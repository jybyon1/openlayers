import { useContext, useEffect, useState, useCallback } from "react";

import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import { Point } from "ol/geom";

import { Circle as CircleStyle, Icon, Style } from "ol/style";

import markerImage from "../assets/images/marker.png";

import MapContext from "../map/MapContext";
import { Coordinate } from "ol/coordinate";
import { gisMapResetStateAtom } from "../store";
import { useRecoilState, useResetRecoilState } from "recoil";

interface MarkerLayerProps {
  zIndex?: number;
  buttonType?: "marker" | "input" | "reset" | "none";
}

const MarkerLayer = ({ zIndex = 20, buttonType }: MarkerLayerProps) => {
  const { map } = useContext(MapContext);

  const [markerLayer, setMarkerLayer] = useState<VectorLayer<any>>();

  const [gisMeasureState, setGisMeasureState] =
    useRecoilState(gisMapResetStateAtom);
  const resetGisMeasureState = useResetRecoilState(gisMapResetStateAtom);

  useEffect(() => {
    if (!map) return;
    const newMarkerLayer = new VectorLayer({
      properties: { id: "markerLayer" },
      source: new VectorSource(),
      zIndex: zIndex,
    });
    setMarkerLayer(newMarkerLayer);
    map.addLayer(newMarkerLayer);

    return () => {
      map.removeLayer(newMarkerLayer);
    };
  }, [map]);

  const addMarker = useCallback(
    (coordinates: Coordinate) => {
      if (!map || !markerLayer) return;
      const marker = new Point(coordinates);
      const newMarkerId = Math.random().toString();
      const markerFeature = new Feature({
        geometry: marker,
        id: newMarkerId,
      });

      const markerStyle = new Style({
        image: new Icon({
          src: markerImage,
          scale: 0.5,
        }),
      });

      markerFeature.setStyle(markerStyle);

      markerLayer.getSource().addFeature(markerFeature);
    },
    [map, markerLayer]
  );

  useEffect(() => {
    if (!map || !markerLayer || buttonType !== "marker") return;

    const handleClick = (event: any) => {
      addMarker(event.coordinate);
    };

    map.on("click", handleClick);

    return () => {
      map.un("click", handleClick);
    };
  }, [map, markerLayer, addMarker, buttonType]);

  useEffect(() => {
    if (gisMeasureState.reset) {
      markerLayer?.getSource().clear();
      setGisMeasureState({ reset: false });
    }
    return () => {
      resetGisMeasureState();
    };
  }, [gisMeasureState.reset]);

  return null;
};

export default MarkerLayer;
