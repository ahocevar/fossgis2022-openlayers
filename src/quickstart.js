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

const marker = new Feature(new Point(lonlat));

map.addLayer(new VectorLayer({
  source: new VectorSource({ features: [marker] }),
  style: new Style({
    image: new Icon({ src: './marker.png', anchor: [0.5, 1] })
  })
}));

const popup = new Popup({ offset: [0, -20] });
map.addOverlay(popup);
marker.set('i', 'A pretty CSS3 popup.<br> Easily customizable.');

const showPopup = (feature) => feature && popup.show(
  feature.getGeometry().getCoordinates(), feature.get('i'));

showPopup(marker);
map.on('click', (e) =>
  showPopup(map.getFeaturesAtPixel(e.pixel)[0]));
map.on('pointermove', (e) => {
  const cursor = map.hasFeatureAtPixel(e.pixel) ? 'pointer' : '';
  map.getTargetElement().style.cursor = cursor;
});
