import { useState } from "react";
import styled from "styled-components";
import Map from "../map/Map";
import { Button } from "../components/Button";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { FaPen } from "react-icons/fa";

import { topLeftControls } from "../styles/map.styled";
import MarkerLayer from "../layer/MarkerLayer";

export type ButtonType = "marker" | "input" | "reset" | "none";
const MainPage = () => {
  const [activeBtn, setActiveBtn] = useState<ButtonType>();
  const [mapReset, setMapReset] = useState<boolean>(false);
  return (
    <ComponentWrapper>
      <Map>
        <TopLeftMapControls>
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
        <MarkerLayer buttonType={activeBtn} reset={mapReset} />
      </Map>
    </ComponentWrapper>
  );
};

const ComponentWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const TopLeftMapControls = styled.div`
  ${topLeftControls}
  top: 280px;
  z-index: 2;
  gap: 5px;
`;

export default MainPage;
