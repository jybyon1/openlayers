import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import MapContext from "./MapContext";
import "ol/ol.css";
import { Map as OlMap, View } from "ol";
import { defaults as defaultControls } from "ol/control";
import { fromLonLat } from "ol/proj";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import { ZoomSlider } from "ol/control";
import { defaults as defaultInteraction } from "ol/interaction";
import { Pointer } from "ol/interaction";

//기본 투영법 : 지도 좌표계 설정
export const DefaultProjection = "EPSG:3857";

const Map = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const mapRef = useRef<HTMLDivElement>(null);

  // 지도 객체 상태 및 설정
  const [mapObj, setMapObj] = useState<OlMap | undefined>(undefined);

  useEffect(() => {
    // Map 객체 생성 및 OSM 배경지도 추가
    const map = new OlMap({
      controls: defaultControls({ zoom: true, rotate: false }).extend([]),
      interactions: defaultInteraction({
        pinchRotate: false,
        doubleClickZoom: false,
      }),
      layers: [
        new TileLayer({
          source: new OSM(), // OpenStreetMap 타일 레 이어
        }),
      ],
      // HTML 요소의 id가 "map"인 요소를 대상으로 함
      target: "map",
      view: new View({
        projection: DefaultProjection,
        center: fromLonLat(
          [127.101003819449, 36.8275878724897],
          DefaultProjection
        ),
        zoom: 9,
      }),
    });
    map.setTarget(mapRef.current!);
    setMapObj(map);

    //줌 슬라이더 생성
    const zoomSlider = new ZoomSlider();
    map.addControl(zoomSlider);

    // 지도 객체 상태 업데이트
    setMapObj(map);
    // 컴포넌트 언마운트 시 지도의 타겟 제거
    return () => map.setTarget(undefined);

    //컴포넌트가 처음 마운트될 때만 실행
  }, []);

  // MapContext.Provider에 지도 객체 저장
  return (
    <MapContext.Provider value={{ map: mapObj }}>
      <MapWrapper id="map" ref={mapRef}>
        {children}
      </MapWrapper>
    </MapContext.Provider>
  );
};

const MapWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

export default Map;
