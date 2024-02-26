// MiniMapControl.jsx

import React, { useContext, useEffect } from "react";

import { OverviewMap } from "ol/control";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";

import styled from "styled-components";
import MapContext from "../MapContext";

const OverviewControl = () => {
  const { map } = useContext(MapContext);

  const OVER_VIEW_MAP_TARGET = "original-overview-map";

  useEffect(() => {
    if (!map) return;

    const miniMapControl = new OverviewMap({
      target: OVER_VIEW_MAP_TARGET,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
    });
    map.addControl(miniMapControl);

    return () => {
      map.removeControl(miniMapControl);
    };
  }, [map]);

  return (
    <ComponentWrapper>
      <OriginalOverviewMap id={OVER_VIEW_MAP_TARGET} />
    </ComponentWrapper>
  );
};

const ComponentWrapper = styled.div``;

const OriginalOverviewMap = styled.div`
  > .ol-overviewmap {
    position: relative;
    width: 22px;
    bottom: 0;
    left: 0;
  }
`;

export default OverviewControl;
