import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { Draw } from "ol/interaction";
import Overlay from "ol/Overlay";
import { unByKey } from "ol/Observable";
import { Circle, LineString, Polygon } from "ol/geom";
import MapContext from "../MapContext";
import { center, columnBox, rowBox } from "../../styles/common.styled";
import { Type as GeometryType } from "ol/geom/Geometry";

import {
  FaDraftingCompass,
  FaRulerCombined,
  FaVectorSquare,
} from "react-icons/fa";
import { Coordinate } from "ol/coordinate";
import { EventsKey } from "ol/events";
import {
  formatArea,
  formatLength,
  formatRadius,
} from "../../utils/measureFormat";
import { getOverlays } from "../../utils/overlay";
import { gisMapResetStateAtom } from "../../store";
import { useRecoilState, useResetRecoilState } from "recoil";

type MeasureType = "LineString" | "Polygon" | "Circle";

const MeaserToolBox = () => {
  const { map } = useContext(MapContext);

  const [gisMeasureState, setGisMeasureState] =
    useRecoilState(gisMapResetStateAtom);
  const resetGisMeasureState = useResetRecoilState(gisMapResetStateAtom);

  const [measureLayer, setMeasureLayer] = useState<VectorLayer<any>>();
  const [measureType, setMeasureType] = useState<MeasureType>();
  const [measureDraw, setMeasureDraw] = useState<Draw>();

  const measureTooltipElement = document.createElement("div");
  measureTooltipElement.className = "ol-tooltip ol-tooltip-measure";
  const measureTooltipIdPrefix = "measure-tooltip";

  const polygonStyle = new Style({
    stroke: new Stroke({
      color: "#3385ff",
      width: 2,
      lineDash: [0, 0],
    }),
    fill: new Fill({
      color: "rgba(255, 255, 255, 0.5)",
    }),
  });

  const drawStyle = new Style({
    fill: new Fill({
      color: "rgba(255, 255, 255, 0.2)",
    }),
    stroke: new Stroke({
      color: "rgba(0, 0, 0, 0.5)",
      lineDash: [10, 10],
      width: 2,
    }),
    image: new CircleStyle({
      radius: 5,
      stroke: new Stroke({
        color: "rgba(0, 0, 0, 0.7)",
      }),
    }),
  });

  useEffect(() => {
    if (!map) return;

    const vector = new VectorLayer({
      source: new VectorSource(),
      style: polygonStyle,
    });
    setMeasureLayer(vector);
    map.addLayer(vector);

    return () => {
      map.removeLayer(vector);
    };
  }, [map]);

  const addInteraction = () => {
    if (!map || !measureLayer) return;

    let type: GeometryType;
    if (measureType === "LineString") {
      type = "LineString";
    } else if (measureType === "Polygon") {
      type = "Polygon";
    } else {
      type = "Circle";
    }
    const draw = new Draw({
      source: measureLayer.getSource(),
      type: type,
      style: drawStyle,
    });
    map.addInteraction(draw);
    setMeasureDraw(draw);

    createMeasureTooltip();
    createMeasureTooltipChangeEvent(draw);
  };

  const createMeasureTooltip = () => {
    if (!map) return;

    const measureTooltips = getOverlays(map, measureTooltipIdPrefix);
    const measureTooltipElement = document.createElement("div");
    measureTooltipElement.className = "ol-tooltip ol-tooltip-measure";
    const measureTooltip = new Overlay({
      id: measureTooltipIdPrefix + measureTooltips.length,
      element: measureTooltipElement,
      offset: [0, -15],
      positioning: "bottom-center",
      stopEvent: false,
      insertFirst: false,
    });
    map.addOverlay(measureTooltip);
  };

  const createMeasureTooltipChangeEvent = (newDraw: Draw) => {
    if (!map) return;

    let changeEventListener: EventsKey;

    newDraw.on("drawstart", (e) => {
      const sketch = e.feature;
      const geometry = sketch.getGeometry();

      if (geometry) {
        changeEventListener = geometry.on("change", (evt) => {
          const geom = evt.target;

          let output = "";
          let tooltipCoord: Coordinate = [0, 0];
          if (geom instanceof LineString) {
            output = formatLength(geom);
            tooltipCoord = geom.getLastCoordinate();
          } else if (geom instanceof Polygon) {
            output = formatArea(geom);
            tooltipCoord = geom.getInteriorPoint().getCoordinates();
          } else if (geom instanceof Circle) {
            output = formatRadius(geom);
            tooltipCoord = geom.getFirstCoordinate();
          }

          const measureTooltips = getOverlays(map, measureTooltipIdPrefix);
          const measureTooltip = measureTooltips[measureTooltips.length - 1];
          const measureTooltipElement = measureTooltip.getElement();
          if (measureTooltipElement) {
            measureTooltipElement.innerHTML = output;
          }
          measureTooltip.setPosition(tooltipCoord);
        });
      }
    });

    newDraw.on("drawend", () => {
      const measureTooltips = getOverlays(map, measureTooltipIdPrefix);
      const measureTooltip = measureTooltips[measureTooltips.length - 1];
      const measureTooltipElement = measureTooltip.getElement();
      if (measureTooltipElement) {
        measureTooltipElement.className = "ol-tooltip ol-tooltip-static";
      }
      measureTooltip.setOffset([0, -7]);

      createMeasureTooltip();
      unByKey(changeEventListener);
    });
  };

  useEffect(() => {
    if (!map || !measureLayer) return;

    if (measureDraw) {
      map.removeInteraction(measureDraw);
      setMeasureDraw(undefined);
    }

    if (measureType) {
      addInteraction();
    }
  }, [map, measureLayer, measureType]);

  const selecteMeasureType = (selectedType: MeasureType) => {
    setMeasureType((prevType) =>
      prevType === selectedType ? undefined : selectedType
    );
  };

  useEffect(() => {
    if (!map || !measureLayer) return;

    if (gisMeasureState.reset) {
      setMeasureType(undefined);
      setGisMeasureState({ reset: false });

      measureLayer.getSource().clear();
      if (measureDraw) {
        map.removeInteraction(measureDraw);
        setMeasureDraw(undefined);
      }
      const measureTooltips = getOverlays(map, measureTooltipIdPrefix);
      measureTooltips.forEach((measureTooltip) =>
        map.removeOverlay(measureTooltip)
      );
    }

    return () => {
      resetGisMeasureState();
    };
  }, [gisMeasureState.reset]);

  return (
    <ComponentWrapper>
      <ToolGroupWapper>
        <ToolButtonGroup>
          <ToolCircleWapper
            $active={measureType === "LineString" ? "true" : "false"}
            onClick={() => selecteMeasureType("LineString")}
          >
            <FaRulerCombined />
          </ToolCircleWapper>
          <ToolText>거리</ToolText>
        </ToolButtonGroup>
        <ToolButtonGroup>
          <ToolCircleWapper
            $active={measureType === "Polygon" ? "true" : "false"}
            onClick={() => selecteMeasureType("Polygon")}
          >
            <FaVectorSquare />
          </ToolCircleWapper>
          <ToolText>면적</ToolText>
        </ToolButtonGroup>
        <ToolButtonGroup>
          <ToolCircleWapper
            $active={measureType === "Circle" ? "true" : "false"}
            onClick={() => selecteMeasureType("Circle")}
          >
            <FaDraftingCompass />
          </ToolCircleWapper>
          <ToolText>반경</ToolText>
        </ToolButtonGroup>
      </ToolGroupWapper>
    </ComponentWrapper>
  );
};

const ComponentWrapper = styled.div`
  position: absolute;
  background-color: #fff;
  top: 370px;
  left: 36px;
  border: #adacac 0.5px solid;
  border-radius: 4px;
`;

const ToolGroupWapper = styled.div`
  ${rowBox}
  gap: 0.5rem;
  padding: 0.5rem;
`;

const ToolButtonGroup = styled.div`
  ${columnBox}
  gap: 0.2rem;
`;

const ToolCircleWapper = styled.div<{ $active: "true" | "false" }>`
  ${center}
  border: #adacac 0.5px solid;
  background-color: ${({ $active }) =>
    $active === "true" ? "#9c9c9c" : "#fff"};
  padding: 0.8rem;
  border-radius: 50%;
  cursor: pointer;
`;

const ToolText = styled.span`
  ${center}
  font-size: 12px;
  font-weight: bold;
`;

export default MeaserToolBox;
