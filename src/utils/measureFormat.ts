import { Circle, LineString, Polygon } from "ol/geom";
import { getArea, getLength } from "ol/sphere.js";

/**
 * Format area output.
 * @param {Polygon} polygon The polygon.
 * @return {string} Formatted area.
 */
export const formatArea = (polygon: Polygon) => {
  const area = getArea(polygon);
  let output;
  if (area > 10000) {
    output = Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>";
  } else {
    output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>";
  }
  return output;
};

export const formatRadius = (circle: Circle): string => {
  const radius = circle.getRadius();
  let output;
  if (radius > 100) {
    output = Math.round((radius / 1000) * 100) / 100 + " " + "km";
  } else {
    output = Math.round(radius * 100) / 100 + " " + "m";
  }
  return output;
};

/**
 * Format length output.
 * @param {LineString} line The line.
 * @return {string} The formatted length.
 */
export const formatLength = function (line: LineString) {
  const length = getLength(line);
  let output;
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + " " + "km";
  } else {
    output = Math.round(length * 100) / 100 + " " + "m";
  }
  return output;
};
