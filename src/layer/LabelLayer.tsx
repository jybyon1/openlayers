import { useEffect, useContext, useState } from "react";
import MapContext from "../map/MapContext";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Overlay } from "ol";
import { Coordinate } from "ol/coordinate";

interface LabelLayerProps {
  zIndex?: number;
  reset?: boolean;
  labelValue: { position: Coordinate; text: string };
}

const LabelLayer = ({
  zIndex = 10,
  reset = false,
  labelValue,
}: LabelLayerProps) => {
  const { map } = useContext(MapContext);
  const [labelLayer, setLabelLayer] = useState<VectorLayer<any>>();

  useEffect(() => {
    if (!map) return;
    const newLabelLayer = new VectorLayer({
      properties: { name: "labelLayer" },
      source: new VectorSource(),
      zIndex: zIndex,
    });
    setLabelLayer(newLabelLayer);
    map.addLayer(newLabelLayer);

    return () => {
      map.removeLayer(newLabelLayer);
    };
  }, [map]);

  useEffect(() => {
    if (!map || !labelLayer) return;

    const inputOverlay = new Overlay({
      element: createLabelElement(labelValue.text),
      autoPan: true,
      offset: [0, 30],
      position: labelValue.position,
      positioning: "center-center",
    });

    map.addOverlay(inputOverlay);

    return () => {
      map.removeOverlay(inputOverlay);
    };
  }, [map, labelLayer]);

  const createLabelElement = (_label: string) => {
    const label = document.createElement("div");
    label.className = "label";
    label.textContent = _label;
    label.style.backgroundColor = "#6726ff";
    label.style.color = "white";
    label.style.fontFamily = "sans-serif";
    label.style.fontSize = "12px";
    label.style.borderRadius = "4px";
    label.style.border = "1px solid white";
    label.style.padding = "2px";

    return label;
  };

  useEffect(() => {
    if (reset) {
      labelLayer?.getSource().clear();
    }
  }, [reset]);

  return null;
};

export default LabelLayer;
