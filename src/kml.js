import 'ol/ol.css';
import KML from 'ol/format/KML';
import Map from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';

var key = 'get_your_own_D6rA4zTHduk6KOKTXzGB';
var attributions =
  '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

var raster = new TileLayer({
  source: new XYZ({
    attributions: attributions,
    url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
    maxZoom: 20,
  }),
});

var vector = new VectorLayer({
  source: new VectorSource({
    url: './data/2012-02-10.kml',
    format: new KML(),
  }),
});

var map = new Map({
  layers: [raster, vector],
  target: document.getElementById('map'),
  view: new View({
    center: [838407.352187509, 5857024.132774355],
    projection: 'EPSG:3857',
    zoom: 14,
  }),
});

var displayFeatureInfo = function (pixel) {
  var features = [];
  map.forEachFeatureAtPixel(pixel, function (feature) {
    features.push(feature);
  });
  if (features.length > 0) {
    var info = [];
    var i, ii;
    for (i = 0, ii = features.length; i < ii; ++i) {
      if (features[i].get('name')) {
        info.push(features[i].get('name'));
      }
    }
    document.getElementById('info').innerHTML = info.join(', ') || '(unknown)';
    map.getTarget().style.cursor = 'pointer';
  } else {
    document.getElementById('info').innerHTML = '';
    map.getTarget().style.cursor = '';
  }
};

map.on('pointermove', function (evt) {
  if (evt.dragging) {
    return;
  }
  var pixel = map.getEventPixel(evt.originalEvent);
  displayFeatureInfo(pixel);
});

map.on('click', function (evt) {
  displayFeatureInfo(evt.pixel);
});
