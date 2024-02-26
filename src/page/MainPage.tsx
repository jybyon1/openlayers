import { useState, useContext, useRef } from "react";
import styled from "styled-components";
import { Button } from "../components/Button";
import { FaTrashAlt, FaMapMarkerAlt, FaPen } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { TiHome } from "react-icons/ti";

import { bottomLeftControls, topLeftControls } from "../styles/map.styled";
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
import InputLayer from "../layer/InputLayer";
import Menu from "../components/Menu";
import { useDisclosure } from "../hook/useDisclosure";
import MeaserToolBox from "../map/components/MeasureToolBox";
import ScaleLineControl from "../map/components/ScaleLineControl";
import MeasureTest from "../map/components/MeasureTest";
import OverviewControl from "../map/components/OverviewControl";

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

  const [inputValue, setInputValue] = useState<string>("");
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

  // 입력 값 업데이트
  const handleInputSubmit = (value: string) => {
    setInputValue(value);
    console.log(value);
  };

  const buttonList = [
    { icon: <TiHome style={{ fontSize: "14px" }} />, onClick: setMapCenter },
    {
      icon: <FaMapMarkerAlt />,
      activeBtn: "marker",
      onClick: () => setActiveBtn("marker"),
    },
    {
      icon: <FaPen />,
      activeBtn: "input",
      onClick: () => setActiveBtn("input"),
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
        {/* <MeaserToolBox reset={mapReset} /> */}
        <MeasureTest />
      </Menu>
      <>
        <MarkerLayer buttonType={activeBtn} reset={mapReset} />
        <InputLayer
          buttonType={activeBtn}
          reset={mapReset}
          setInputValue={setInputValue}
        />
        <LabelLayer reset={mapReset} labelValue={labelValue} />
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
