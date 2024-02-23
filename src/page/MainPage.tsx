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

  const handleInputSubmit = (value: string) => {
    // 입력 값 업데이트
    setInputValue(value);
    console.log(value);
  };

  return (
    <ComponentWrapper>
      <TopLeftMapControls>
        <Button onClick={() => setMapCenter()}>
          <TiHome style={{ fontSize: "14px" }} />
        </Button>
        <Button
          active={activeBtn === "marker"}
          onClick={() => setActiveBtn("marker")}
        >
          <FaMapMarkerAlt />
        </Button>
        <Button
          active={activeBtn === "input"}
          onClick={() => setActiveBtn("input")}
        >
          <FaPen />
        </Button>
        <Button
          onClick={() => {
            setActiveBtn("reset");
            setMapReset(!mapReset);
          }}
        >
          <FaTrashAlt />
        </Button>
        <Button
          ref={toolboxButtonRef}
          onClick={() => {
            onToolboxToggle();
          }}
        >
          <HiOutlineDotsHorizontal />
        </Button>
      </TopLeftMapControls>
      <BottomLeftMapControls>
        <ScaleLineControl />
      </BottomLeftMapControls>
      <Menu
        isOpen={isToolboxOpen}
        onClose={onToolboxClose}
        triggerRef={toolboxButtonRef}
      >
        <MeaserToolBox />
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
  gap: 5px;
`;

const BottomLeftMapControls = styled.div`
  ${bottomLeftControls};
  z-index: 2;
  bottom: -910px;
`;

export default MainPage;
