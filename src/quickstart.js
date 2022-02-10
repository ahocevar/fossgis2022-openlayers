import 'ol/ol.css';
import 'ol-popup/src/ol-popup.css';
import { Map, Overlay, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { useGeographic } from 'ol/proj';
import { OSM } from 'ol/source';
import Marker from 'ol-marker-feature';
import Popup from 'ol-popup';

useGeographic();

const lonlat = [-0.159, 51.504];

const map = new Map({
  target: 'map',
  view: new View({ center: lonlat, zoom: 15 })
});

map.addLayer(new TileLayer({ source: new OSM() }));

const marker = new Marker({ position: lonlat });
marker.setMap(map);

const popup = new Popup({ offset: [0, -32] });
map.addOverlay(popup);

marker.on('click', () => popup.show(lonlat,
  'A pretty CSS3 popup.<br> Easily customizable.'));
marker.dispatchEvent('click');

