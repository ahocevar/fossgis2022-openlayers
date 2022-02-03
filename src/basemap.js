import "ol/ol.css";
import olms from "ol-mapbox-style";
import { fromLonLat } from "ol/proj";
import { View } from "ol";
import TileLayer from "ol/layer/Tile";
import { XYZ } from "ol/source";

olms(
  "map",
  "https://maps.wien.gv.at/basemapv/bmapv/3857/resources/styles/root.json"
).then((map) => {
  map.addLayer(new TileLayer({
    zIndex: -1,
    opacity: 0.5,
    source: new XYZ({
      attributions: ['Grundkarte: <a target="_blank" href="https://basemap.at/">basemap.at</a>'],
      attributionsCollapsible: false,
      transition: 0,
      url: 'https://maps{1-4}.wien.gv.at/basemap/bmapgelaende/grau/google3857/{z}/{y}/{x}.jpeg'
    })
  }));
  map.setView(
    new View({
      minZoom: 7,
      zoom: 15,
      center: fromLonLat([15.437054, 47.142729])
    })
  );
});
