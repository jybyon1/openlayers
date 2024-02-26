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

type MeasureType = "LineString" | "Polygon" | "Circle";

const MeasureTest = () => {
  const { map } = useContext(MapContext);

  const [measureLayer, setMeasureLayer] = useState<VectorLayer<any>>();
  const [measureType, setMeasureType] = useState<MeasureType>();
  const [measureTooltip, setMeasureTooltip] = useState<Overlay>();
  const [measureDraw, setMeasureDraw] = useState<Draw>();

  const measureTooltipElement = document.createElement("div");
  measureTooltipElement.className = "ol-tooltip ol-tooltip-measure";

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
      fill: new Fill({
        color: "rgba(255, 255, 255, 0.2)",
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
    addMeasureTooltipChangeEvent(draw);
  };

  const addMeasureTooltipChangeEvent = (newDraw: Draw) => {
    if (!map || !measureTooltip) return;

    let changeEventListener: EventsKey;

    newDraw.on("drawstart", (e) => {
      const sketch = e.feature;
      const geometry = sketch.getGeometry();

      let tooltipCoord: Coordinate;
      if (geometry) {
        changeEventListener = geometry.on("change", (evt) => {
          const geom = evt.target;
          let output;
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
          if (output) measureTooltipElement.innerHTML = output;
          measureTooltip.setPosition(tooltipCoord);
        });
      }
    });

    newDraw.on("drawend", () => {
      measureTooltip.setOffset([0, 0]);

      createMeasureTooltip();
      // 이벤트 리스너를 해제하는 메소드
      unByKey(changeEventListener);
    });
  };

  const createMeasureTooltip = () => {
    if (!map) return;

    const _measureTooltip = new Overlay({
      element: measureTooltipElement,
      offset: [0, -15],
      positioning: "bottom-center",
      stopEvent: false,
      insertFirst: false,
    });
    map.addOverlay(_measureTooltip);
    setMeasureTooltip(_measureTooltip);
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
  top: 401px;
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

export default MeasureTest;
