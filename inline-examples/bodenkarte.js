import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import { apply } from 'ol-mapbox-style';
import stylefunction from 'ol-mapbox-style/dist/stylefunction';
import { MVT } from 'ol/format';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import {recordStyleLayer} from 'ol-mapbox-style/dist/stylefunction';

recordStyleLayer(true);

const bodenkarte = new VectorTileLayer({
  opacity: 0.7,
  minZoom: 6,
  source: new VectorTileSource({
    attributions: ['&copy; 2018-present <a href=\"https://www.bfw.ac.at/\">BFW</a>'],
    url: 'https://bodenkarte.at/data/bodenkarte-tiles/{z}/{x}/{y}.pbf',
    format: new MVT(),
    minZoom: 6,
    maxZoom: 15
  })
});
fetch('https://bodenkarte.at/styles/typengruppe.json').then(style => style.json()).then(style => {
  bodenkarte.setStyle(stylefunction(bodenkarte, style, 'bodenkarte-tiles'));
});

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    bodenkarte
  ],
  view: new View({
    center: fromLonLat([15.4370540, 47.1427290]),
    zoom: 14,
  })
});

map.on('pointermove', (event) => {
  bodenkarte.getFeatures(event.pixel).then(([feature]) => {
    map.getTargetElement().title = feature ? `${feature.get('bofo_id')} (${feature.get('mapbox-layer').id})` : ''
  });
});