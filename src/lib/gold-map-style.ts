import type { StyleSpecification } from "maplibre-gl";

const CREAM = "#f3ebdd";
const PARK = "#dce1cc";
const WOOD = "#d5dbc4";
const WATER = "#7aa9bb";
const WATERWAY = "#8eb9c6";
const ROAD = "#fbf6ec";
const ROAD_EDGE = "#e7dfd0";
const LABEL = "#4a4033";

const lineGeom: ["match", ["geometry-type"], ["LineString", "MultiLineString"], true, false] = [
  "match",
  ["geometry-type"],
  ["LineString", "MultiLineString"],
  true,
  false,
];
const fillGeom: ["match", ["geometry-type"], ["Polygon", "MultiPolygon"], true, false] = [
  "match",
  ["geometry-type"],
  ["Polygon", "MultiPolygon"],
  true,
  false,
];

export const goldMapStyle: StyleSpecification = {
  version: 8,
  name: "Gold schematic",
  sources: {
    openmaptiles: {
      type: "vector",
      url: "https://tiles.openfreemap.org/planet",
    },
  },
  glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
  layers: [
    {
      id: "background",
      type: "background",
      paint: { "background-color": CREAM },
    },
    {
      id: "park",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "park",
      filter: fillGeom,
      paint: { "fill-color": PARK, "fill-opacity": 0.85 },
    },
    {
      id: "landcover-green",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landcover",
      minzoom: 9,
      filter: ["all", fillGeom, ["match", ["get", "class"], ["wood", "grass"], true, false]],
      paint: { "fill-color": WOOD, "fill-opacity": 0.55 },
    },
    {
      id: "waterway",
      type: "line",
      source: "openmaptiles",
      "source-layer": "waterway",
      filter: lineGeom,
      paint: {
        "line-color": WATERWAY,
        "line-opacity": 0.7,
        "line-width": ["interpolate", ["linear"], ["zoom"], 10, 0.6, 13, 1.4],
      },
    },
    {
      id: "water",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "water",
      filter: ["all", fillGeom, ["!=", ["get", "brunnel"], "tunnel"]],
      paint: { "fill-color": WATER, "fill-antialias": true, "fill-opacity": 0.82 },
    },
    {
      id: "road-secondary-edge",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      minzoom: 11,
      filter: ["all", lineGeom, ["==", ["get", "class"], "secondary"]],
      paint: {
        "line-color": ROAD_EDGE,
        "line-opacity": 0.55,
        "line-width": ["interpolate", ["linear"], ["zoom"], 11, 1.6, 13, 3.2],
      },
    },
    {
      id: "road-secondary",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      minzoom: 11,
      filter: ["all", lineGeom, ["==", ["get", "class"], "secondary"]],
      paint: {
        "line-color": ROAD,
        "line-opacity": 0.9,
        "line-width": ["interpolate", ["linear"], ["zoom"], 11, 1, 13, 2.1],
      },
    },
    {
      id: "road-main-edge",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      minzoom: 8,
      filter: [
        "all",
        lineGeom,
        ["match", ["get", "class"], ["motorway", "trunk", "primary"], true, false],
      ],
      paint: {
        "line-color": ROAD_EDGE,
        "line-opacity": 0.5,
        "line-width": ["interpolate", ["linear"], ["zoom"], 8, 1.8, 13, 5],
      },
    },
    {
      id: "road-main",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      minzoom: 8,
      filter: [
        "all",
        lineGeom,
        ["match", ["get", "class"], ["motorway", "trunk", "primary"], true, false],
      ],
      paint: {
        "line-color": ROAD,
        "line-width": ["interpolate", ["linear"], ["zoom"], 8, 1.1, 13, 3.2],
      },
    },
    {
      id: "place-area",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "place",
      minzoom: 11,
      filter: ["match", ["get", "class"], ["suburb", "neighbourhood"], true, false],
      layout: {
        "text-field": ["coalesce", ["get", "name:latin"], ["get", "name"]],
        "text-font": ["Noto Sans Regular"],
        "text-size": 11.5,
        "text-transform": "uppercase",
        "text-letter-spacing": 0.1,
        "text-max-width": 9,
        "text-padding": 18,
        "text-allow-overlap": false,
      },
      paint: {
        "text-color": LABEL,
        "text-opacity": 0.58,
        "text-halo-color": CREAM,
        "text-halo-width": 1.6,
      },
    },
    {
      id: "place-city",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "place",
      filter: ["match", ["get", "class"], ["city", "town"], true, false],
      layout: {
        "text-field": ["coalesce", ["get", "name:latin"], ["get", "name"]],
        "text-font": ["Noto Sans Regular"],
        "text-size": ["interpolate", ["linear"], ["zoom"], 9, 13, 13, 18],
        "text-transform": "uppercase",
        "text-letter-spacing": 0.14,
        "text-max-width": 8,
        "text-padding": 24,
      },
      paint: {
        "text-color": LABEL,
        "text-opacity": 0.62,
        "text-halo-color": CREAM,
        "text-halo-width": 1.8,
      },
    },
  ],
};
