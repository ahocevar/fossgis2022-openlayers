import "ol/ol.css";
import { setUserProjection } from "ol/proj";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { XYZ } from "ol/source";
import { register } from "ol/proj/proj4";
import proj4 from "proj4";
import { MousePosition, ScaleLine } from "ol/control";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Draw } from "ol/interaction";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Text from "ol/style/Text";
import Circle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Point from "ol/geom/Point";

proj4.defs('EPSG:31259', '+proj=tmerc +lat_0=0 +lon_0=16.33333333333333 +k=1 +x_0=750000 +y_0=-5000000 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs');
register(proj4);

setUserProjection('EPSG:31259');

const map = new Map({
  target: 'map',
  layers: [new TileLayer({
    source: new XYZ({
      maxZoom: 20,
      attributions: ['Grundkarte: <a target="_blank" href="https://basemap.at/">basemap.at</a>'],
      attributionsCollapsible: false,
      url: 'https://maps{1-4}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png'
    })
  })],
  view: new View({
    zoom: 18,
    center: [753056, 341114],
    extent: [226942.84, 162621.12, 811288.27, 431698.18],
    showFullExtent: true
  })
});

map.addControl(new ScaleLine());
map.addControl(new MousePosition({
  coordinateFormat: (coordinate) => {
    return `RW: ${coordinate[0].toFixed(1)}<br>HW: ${coordinate[1].toFixed(1)}<br>MGI / Austria GK M34`;
  }
}));

const pointStyle = new Style({
  image: new Circle({
    radius: 5,
    fill: new Fill({
      color: '#ffcc33'
    }),
    stroke: new Stroke({
      color: 'white',
      width: 2
    }),
  })
});
const lineStyle = [
  new Style({
    stroke: new Stroke({
      color: '#ffcc33',
      width: 3
    }),
    text: new Text({
      font: '16px Calibri,sans-serif',
      placement: 'line',
      overflow: true
    })
  }),
  pointStyle.clone(),
  pointStyle.clone()
];

const measureStyle = function(feature) {
  const geometry = feature.getGeometry();
  if (geometry.getType() === 'LineString') {
    lineStyle[0].getText().setText(geometry.getLength().toFixed(2) + ' m');
    lineStyle[1].setGeometry(new Point(geometry.getFirstCoordinate()));
    lineStyle[2].setGeometry(new Point(geometry.getLastCoordinate()));
    return lineStyle;
  }
  pointStyle.setGeometry(null);
  return pointStyle;
}

const measure = new VectorLayer({
  source: new VectorSource(),
  style: measureStyle
});
map.addLayer(measure);

const draw = new Draw({
  style: measureStyle,
  source: measure.getSource(),
  type: 'LineString'
});
map.addInteraction(draw);

draw.on('drawend', (event) => {
  setTimeout(() => {
    measure.getSource().removeFeature(event.feature);
  }, 10000);
})
