import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import {
  FaDraftingCompass,
  FaRulerCombined,
  FaVectorSquare,
} from "react-icons/fa";

import MapContext from "../MapContext";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { center, columnBox, rowBox } from "../../styles/common.styled";
import { Draw } from "ol/interaction";
import { getArea, getLength } from "ol/sphere.js";
import { LineString, Polygon } from "ol/geom";
import { Coordinate } from "ol/coordinate";
import { unByKey } from "ol/Observable";
import { Overlay } from "ol";
import { Fill, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import { Type as GeometryType } from "ol/geom/Geometry";

type MeasureType = "LineString" | "Polygon" | "Circle";

const MeaserToolBox = () => {
  const { map } = useContext(MapContext);

  const [measureLayer, setMeasureLayer] = useState<VectorLayer<any>>();
  const [measureTooltip, setMeasureTooltip] = useState<Overlay>();
  const [measureType, setMeasureType] = useState<MeasureType>();
  const [measureDraw, setMeasureDraw] = useState<Draw>();

  const measureTooltipElement = document.createElement("div");

  useEffect(() => {
    console.log("measureTooltip", measureTooltip);
  }, [measureTooltip]);

  const style = new Style({
    fill: new Fill({
      color: "rgba(255, 255, 255, 0.384)",
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

    const _measureLayer = new VectorLayer({
      source: new VectorSource(),
      style: style,
      zIndex: 100,
    });

    setMeasureLayer(_measureLayer);
    map.addLayer(_measureLayer);

    return () => {
      map.removeLayer(_measureLayer);
    };
  }, [map]);

  /**
   * Format area output.
   * @param {Polygon} polygon The polygon.
   * @return {string} Formatted area.
   */
  const formatArea = (polygon: Polygon) => {
    const area = getArea(polygon);
    let output;
    if (area > 10000) {
      output =
        Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>";
    } else {
      output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>";
    }
    return output;
  };

  /**
   * Format length output.
   * @param {LineString} line The line.
   * @return {string} The formatted length.
   */
  const formatLength = function (line: LineString) {
    const length = getLength(line);
    let output;
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + " " + "km";
    } else {
      output = Math.round(length * 100) / 100 + " " + "m";
    }
    return output;
  };

  const createMeasureTooltip = () => {
    if (!map) return;

    if (measureTooltip) {
      map.removeOverlay(measureTooltip);
    }

    if (measureTooltipElement) {
      measureTooltipElement?.parentNode?.removeChild(measureTooltipElement);
    }
    measureTooltipElement.className = "ol-tooltip ol-tooltip-measure";
    const _measureTooltip = new Overlay({
      element: measureTooltipElement,
      offset: [0, -15],
      positioning: "bottom-center",
      stopEvent: false,
      insertFirst: false,
    });
    setMeasureTooltip(_measureTooltip);
    map.addOverlay(_measureTooltip);
  };

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
    });

    createMeasureTooltip();

    map.addInteraction(draw);
    setMeasureDraw(draw);

    let listener: any;
    draw.on("drawstart", (e) => {
      // set sketch
      const sketch = e.feature;
      const geometry = sketch.getGeometry();

      let tooltipCoord: Coordinate;
      if (geometry) {
        listener = geometry.on("change", (evt) => {
          const geom = evt.target;
          let output;
          if (geom instanceof Polygon) {
            output = formatArea(geom);
            tooltipCoord = geom.getInteriorPoint().getCoordinates();
          } else if (geom instanceof LineString) {
            output = formatLength(geom);
            tooltipCoord = geom.getLastCoordinate();
          }
          if (output) measureTooltipElement.innerHTML = output;
          if (measureTooltip) measureTooltip.setPosition(tooltipCoord);
        });
      }
    });

    draw.on("drawend", () => {
      measureTooltipElement.className = "ol-tooltip ol-tooltip-static";
      if (measureTooltip) measureTooltip.setOffset([0, -7]);

      createMeasureTooltip();
      // 이벤트 리스너를 해제하는 메소드
      unByKey(listener);
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

export default MeaserToolBox;
