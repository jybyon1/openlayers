import { useState, useContext } from "react";
import styled from "styled-components";
import Map from "../map/Map";
import { Button } from "../components/Button";
import { FaTrashAlt, FaMapMarkerAlt, FaPen } from "react-icons/fa";
import { TiHome } from "react-icons/ti";

import { topLeftControls } from "../styles/map.styled";
import MarkerLayer from "../layer/MarkerLayer";
import { Coordinate } from "ol/coordinate";
import LabelLayer from "../layer/LabelLayer";
import {
  DefaultProjection,
  mapCoordinate,
  mapZoom,
} from "../constants/mapConfig";
import { fromLonLat } from "ol/proj";
import MapContext from "../map/MapContext";

export type ButtonType = "marker" | "input" | "reset" | "none";
const MainPage = () => {
  const { map } = useContext(MapContext);

  const [activeBtn, setActiveBtn] = useState<ButtonType>();
  const [mapReset, setMapReset] = useState<boolean>(false);

  const [labelValue, setLabelValue] = useState<{
    position: Coordinate;
    text: string;
  }>({
    position: fromLonLat(mapCoordinate, DefaultProjection),
    text: "",
  });

  const setMapCenter = () => {
    if (!map) return;

    map.getView().animate(
      {
        center: fromLonLat(mapCoordinate, DefaultProjection),
        zoom: mapZoom,
      },
      { duration: 1000 }
    );
  };

  return (
    <ComponentWrapper>
      <TopLeftMapControls>
        <Button
          icon={<TiHome style={{ fontSize: "14px" }} />}
          onClick={() => setMapCenter()}
        />
        <Button
          icon={<FaMapMarkerAlt />}
          active={activeBtn === "marker"}
          onClick={() => setActiveBtn("marker")}
        />
        <Button
          icon={<FaPen />}
          active={activeBtn === "input"}
          onClick={() => setActiveBtn("input")}
        />
        <Button
          icon={<FaTrashAlt />}
          onClick={() => {
            setActiveBtn("reset");
            setMapReset(!mapReset);
          }}
        />
      </TopLeftMapControls>
      <MarkerLayer
        buttonType={activeBtn}
        reset={mapReset}
        setInputValue={setLabelValue}
      />
      <LabelLayer reset={mapReset} labelValue={labelValue} />
    </ComponentWrapper>
  );
};

const ComponentWrapper = styled.div`
  position: absolute;
`;

const TopLeftMapControls = styled.div`
  ${topLeftControls}
  top: 280px;
  z-index: 2;
  gap: 5px;
`;

export default MainPage;
