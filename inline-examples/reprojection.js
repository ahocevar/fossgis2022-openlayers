import 'ol/ol.css';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import WMTS, {optionsFromCapabilities} from 'ol/source/WMTS';
import WMTSCapabilities from 'ol/format/WMTSCapabilities';
import proj4 from 'proj4';
import {OSM, TileImage, TileWMS} from 'ol/source';
import {get as getProjection, fromLonLat} from 'ol/proj';
import {register} from 'ol/proj/proj4';


import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import counties from './data/british-isles-counties.geojson?url';

import {Stroke, Style} from 'ol/style';

proj4.defs(
  'EPSG:27700',
  '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 ' +
    '+x_0=400000 +y_0=-100000 +ellps=airy ' +
    '+towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 ' +
    '+units=m +no_defs'
);

register(proj4);

var proj27700 = getProjection('EPSG:27700');
proj27700.setExtent([-650000, -150000, 1350000, 1450000]);

var layers = {};

layers['osm'] = new TileLayer({
  source: new OSM(),
});

var parser = new WMTSCapabilities();

layers['bng'] = new TileLayer();
var urlB =
  'https://tiles.arcgis.com/tiles/qHLhLQrcvEnxjtPr/arcgis/rest/services/OS_Open_Raster/MapServer/WMTS';
fetch(urlB)
  .then(function (response) {
    return response.text();
  })
  .then(function (text) {
    var result = parser.read(text);
    var options = optionsFromCapabilities(result, {
      layer: 'OS_Open_Raster',
    });
    options.attributions =
      'Contains OS data © Crown Copyright and database right ' +
      new Date().getFullYear();
    options.crossOrigin = '';
    options.projection = 'EPSG:27700';
    options.wrapX = false;
    layers['bng'].setSource(new WMTS(options));
  });

layers['vector'] = new VectorLayer({
  source: new VectorSource({
    url: counties,
    format: new GeoJSON(),
    attributions: '<a href="https://gist.github.com/duhaime/1d6d5a8dc77c86128fcc1a05a72726c9">Counties, D. Duhaime</a>', 
  }),
  style: new Style({
    stroke: new Stroke({
      color: '#8B0000',
      width: 1.3,
    })
  }),
});

var map = new Map({
  layers: [layers['osm'], layers['bng'], layers['vector']],
  target: 'map',
  view: new View({
    projection: 'EPSG:3857',
    center: fromLonLat([0, 54]),
    zoom: 4,
  }),
});