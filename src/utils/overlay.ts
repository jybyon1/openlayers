import OlMap from "ol/Map";
import Overlay from "ol/Overlay";

export const getOverlay = (
  map: OlMap,
  overlayId: string
): Overlay | undefined => {
  return map
    .getOverlays()
    .getArray()
    .find((overlay: Overlay) => overlay.getId() === overlayId);
};

export const getOverlays = (map: OlMap, idPrefix: string): Overlay[] => {
  return map
    .getOverlays()
    .getArray()
    .filter((overlay: Overlay) => {
      const overlayId = overlay.getId() as string;
      return overlayId.startsWith(idPrefix);
    });
};
