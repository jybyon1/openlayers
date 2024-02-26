import { useContext, useEffect } from "react";

import { ScaleLine } from "ol/control";

import styled from "styled-components";
import MapContext from "../MapContext";

const ScaleLineControl = () => {
  const { map } = useContext(MapContext);

  const SCALE_LINE_TARGET = "original-scale-line";

  useEffect(() => {
    if (!map) return;

    const scaleLineControl = new ScaleLine({
      target: SCALE_LINE_TARGET,
    });
    map.addControl(scaleLineControl);

    return () => {
      map.removeControl(scaleLineControl);
    };
  }, [map]);

  return (
    <ComponentWrapper>
      <OriginalScaleLine id={SCALE_LINE_TARGET} />
    </ComponentWrapper>
  );
};

const ComponentWrapper = styled.div``;

const OriginalScaleLine = styled.div`
  > .ol-scale-line {
    width: 70px;
    background-color: white;
    position: relative;
    bottom: 0;
    left: 0;
  }
  .ol-scale-line-inner {
    color: black;
  }
`;

export default ScaleLineControl;
