import react, { useContext, useEffect, useState } from "react";

import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import { Point } from "ol/geom";
import { Pointer as PointerInteraction } from "ol/interaction";
import { Select } from "ol/interaction";
import { click } from "ol/events/condition";
import { Overlay } from "ol";
import { getCenter } from "ol/extent";
import { Circle as CircleStyle, Fill, Icon, Style, Stroke } from "ol/style";

import markerImage from "../assets/images/marker.png";

import MapContext from "../map/MapContext";

interface MarkerLayerProps {
  reset?: boolean;
  zIndex?: number;
  buttonType?: "marker" | "input" | "reset" | "none";
}

const MarkerLayer = ({
  reset = false,
  zIndex = 20,
  buttonType,
}: MarkerLayerProps) => {
  const { map } = useContext(MapContext);

  const [markerLayer, setMarkerLayer] = useState<VectorLayer<any>>();
  const [markerIdList, setMarkerIdList] = useState<string[]>([]);

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

  useEffect(() => {
    if (!map || !markerLayer || buttonType !== "marker") return;

    // 클릭 이벤트 추가
    const selectInteraction = new PointerInteraction({
      handleDownEvent: (event) => {
        addMarker(event.coordinate);
        return true;
      },
    });

    map.addInteraction(selectInteraction);

    return () => {
      map.removeInteraction(selectInteraction);
    };
  }, [map, markerLayer, markerIdList, buttonType]);

  const addMarker = (coordinates: number[]) => {
    if (!map || !markerLayer) return;
    const marker = new Point(coordinates);
    const newMarkerId = Math.random().toString();
    setMarkerIdList((prev) => [...prev, newMarkerId]);
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
  };

  useEffect(() => {
    if (reset) {
      markerLayer?.getSource().clear();
    }
  }, [reset]);

  // marker 선택
  //TODO: 이전 스타일 가져와서 마커가 선택될 경우 Overlay로 input창 띄우기
  useEffect(() => {
    if (!map || !markerLayer || buttonType !== "input") return;
    const selectInteraction = new Select({
      layers: [markerLayer],
      condition: click,
      style: new Style({
        image: new CircleStyle({
          radius: 3,
          fill: new Fill({
            color: "#ffdf53",
          }),
          stroke: new Stroke({
            color: "white",
            width: 1,
          }),
        }),
      }),
    });

    let inputOverlay: Overlay;

    selectInteraction.on("select", (event) => {
      if (event.selected.length > 0) {
        const _selectedFeature = event.selected[0];
        const _markerId = _selectedFeature.getProperties().id;

        //오버레이 초기화
        map.getOverlays().clear();

        markerIdList.forEach((id) => {
          if (id === _markerId) {
            const extent = _selectedFeature.getGeometry()?.getExtent();
            const center = extent ? getCenter(extent) : null;
            if (!center) return;

            inputOverlay = new Overlay({
              element: createLabelElement(),
              position: center,
              positioning: "center-center",
              stopEvent: false,
              offset: [0, 30],
            });

            map.addOverlay(inputOverlay);
          }
        });
      }
    });

    map.addInteraction(selectInteraction);

    return () => {
      map.removeInteraction(selectInteraction);
      map.removeOverlay(inputOverlay);
    };
  }, [map, markerLayer, buttonType]);

  const createLabelElement = () => {
    const input = document.createElement("input");
    input.style.width = "100px";
    input.style.height = "20px";
    input.style.border = "none";
    input.className = "input-overlay";

    return input;
  };

  return null;
};

export default MarkerLayer;
