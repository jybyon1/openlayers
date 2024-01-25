import { useEffect, useContext, useState } from "react";
import MapContext from "../map/MapContext";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { set } from "ol/transform";
import { Overlay } from "ol";

interface LabelLayerProps {
  zIndex?: number;
}

const LabelLayer = ({ zIndex = 30 }: LabelLayerProps) => {
  const { map } = useContext(MapContext);
  const [labelLayer, setLabelLayer] = useState<VectorLayer<any>>();
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

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
      element: document.getElementById("label-input") as HTMLElement,
      autoPan: true,
      offset: [0, -15],
      positioning: "bottom-center",
    });

    setOverlay(inputOverlay);

    map.addOverlay(inputOverlay);
  }, [map, labelLayer]);

  return null;
};

export default LabelLayer;
