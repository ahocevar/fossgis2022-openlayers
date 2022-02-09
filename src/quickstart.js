import 'ol/ol.css';
import 'ol-popup/src/ol-popup.css';
import { Feature, Map, Overlay, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { useGeographic } from 'ol/proj';
import { OSM } from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import { Point } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import { Style, Icon} from 'ol/style';
import Popup from 'ol-popup';

useGeographic();

const lonlat = [-0.159, 51.504];

const map = new Map({
  target: 'map',
  view: new View({ center: lonlat, zoom: 15 })
});

map.addLayer(new TileLayer({ source: new OSM() }));

const icon = document.createElement('img');
icon.src = './marker.png';
icon.style.cursor = 'pointer';
const marker = new Overlay({
  position: lonlat,
  positioning: 'bottom-center',
  element: icon,
  stopEvent: false,
});
map.addOverlay(marker);

const popup = new Popup({ offset: [0, -20] });
map.addOverlay(popup);

const showPopup = () => popup.show(
  marker.getPosition(), 'A pretty CSS3 popup.<br> Easily customizable.');

showPopup();
icon.addEventListener('click', showPopup);

