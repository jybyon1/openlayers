import { useState, useContext, useRef } from "react";
import styled from "styled-components";
import { Button } from "../components/Button";
import { FaTrashAlt, FaMapMarkerAlt } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { TiHome } from "react-icons/ti";

import { bottomLeftControls, topLeftControls } from "../styles/map.styled";
import MarkerLayer from "../layer/MarkerLayer";
import {
  DefaultProjection,
  mapCoordinate,
  mapZoom,
} from "../constants/mapConfig";
import { fromLonLat } from "ol/proj";
import MapContext from "../map/MapContext";
import Menu from "../components/Menu";
import { useDisclosure } from "../hook/useDisclosure";
import ScaleLineControl from "../map/components/ScaleLineControl";
import OverviewControl from "../map/components/OverviewControl";
import MeaserToolBox from "../map/components/MeaserToolBox";

export type ButtonType = "marker" | "input" | "reset" | "none";
const MainPage = () => {
  const { map } = useContext(MapContext);

  const toolboxButtonRef = useRef<HTMLButtonElement>(null);

  const {
    isOpen: isToolboxOpen,
    onClose: onToolboxClose,
    onToggle: onToolboxToggle,
  } = useDisclosure();

  const [activeBtn, setActiveBtn] = useState<ButtonType>();
  const [mapReset, setMapReset] = useState<boolean>(false);

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

  const buttonList = [
    { icon: <TiHome style={{ fontSize: "14px" }} />, onClick: setMapCenter },
    {
      icon: <FaMapMarkerAlt />,
      activeBtn: "marker",
      onClick: () => setActiveBtn("marker"),
    },
    {
      icon: <FaTrashAlt />,
      onClick: () => {
        setActiveBtn("reset");
        setMapReset(!mapReset);
      },
    },
    { icon: <HiOutlineDotsHorizontal />, onClick: onToolboxToggle },
  ];

  return (
    <ComponentWrapper>
      <TopLeftMapControls>
        {buttonList.map((button, index) => (
          <Button
            key={index}
            active={button.activeBtn ? activeBtn === button.activeBtn : false}
            ref={button.activeBtn === "toolbox" ? toolboxButtonRef : null}
            onClick={button.onClick}
          >
            {button.icon}
          </Button>
        ))}
      </TopLeftMapControls>
      <BottomLeftMapControls>
        <OverviewControl />
        <ScaleLineControl />
      </BottomLeftMapControls>
      <Menu
        isOpen={isToolboxOpen}
        onClose={onToolboxClose}
        triggerRef={toolboxButtonRef}
      >
        <MeaserToolBox reset={mapReset} />
      </Menu>
      <>
        <MarkerLayer buttonType={activeBtn} reset={mapReset} />
      </>
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
  gap: 0.3rem;
`;

const BottomLeftMapControls = styled.div`
  ${bottomLeftControls};
  z-index: 2;
  bottom: -910px;
  gap: 0.3rem;
`;

export default MainPage;
