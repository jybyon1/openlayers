import { useContext, useEffect, useState, useCallback } from "react";

import { styled } from "styled-components";

import MapContext from "../map/MapContext";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Coordinate } from "ol/coordinate";
import { Overlay } from "ol";
import Input from "../components/Input";
import { Button } from "../components/Button";

interface InputLayerProps {
  reset?: boolean;
  zIndex?: number;
  buttonType?: "marker" | "input" | "reset" | "none";
  setInputValue: (value: string) => void;
}

const InputLayer = ({
  reset = false,
  zIndex = 21,
  setInputValue,
  buttonType,
}: InputLayerProps) => {
  const { map } = useContext(MapContext);

  const [inputLayer, setInputLayer] = useState<VectorLayer<any>>();
  const [inputOverlay, setInputOverlay] = useState<Overlay>();
  const [inputPosition, setInputPosition] = useState<Coordinate | undefined>();

  const [value, setValue] = useState("");

  useEffect(() => {
    if (!map || buttonType !== "input") return;

    const newInputLayer = new VectorLayer({
      properties: { id: "inputLayer" },
      source: new VectorSource(),
      zIndex: zIndex,
    });
    setInputLayer(newInputLayer);
    map.addLayer(newInputLayer);

    return () => {
      map.removeLayer(newInputLayer);
    };
  }, [map]);

  const addInput = useCallback(
    (coordinates: Coordinate) => {
      if (!map || !inputLayer) return;
      //오버레이 초기화
      map.getOverlays().clear();
      const newOverlay = new Overlay({
        element: inputOverlay?.getElement(),
        position: coordinates,
        positioning: "center-center",
        stopEvent: false,
        offset: [0, 30],
      });

      console.log(1, inputOverlay?.getElement());
      map.addOverlay(newOverlay);

      setInputOverlay(newOverlay);
      setInputPosition(coordinates);

      return () => {
        map.removeOverlay(newOverlay);
      };
    },
    [map, inputLayer, inputPosition]
  );

  useEffect(() => {
    if (!map || !inputLayer || buttonType !== "input") return;

    const handleClick = (event: any) => {
      addInput(event.coordinate);
    };

    map.on("click", handleClick);

    return () => {
      map.un("click", handleClick);
    };
  }, [map, inputLayer, addInput, buttonType]);

  useEffect(() => {
    if (inputOverlay && inputPosition) {
      inputOverlay.setPosition(inputPosition);
    }
  }, [inputOverlay, inputPosition]);

  useEffect(() => {
    if (reset) {
      inputLayer?.getSource().clear();
      setInputPosition(undefined);
    }
  }, [reset]);

  return (
    <ComponentWrapper $show={buttonType === "input" ? "true" : "false"}>
      <Input onChange={(e) => setValue(e.target.value)} />
      <Button onClick={() => setInputValue(value)}>입력</Button>
    </ComponentWrapper>
  );
};

const ComponentWrapper = styled.div<{ $show: "true" | "false" }>`
  display: ${({ $show }) => ($show === "true" ? "flex" : "none")};
  gap: 0.1rem;
  height: 100%;
  width: 100%;
`;

export default InputLayer;
