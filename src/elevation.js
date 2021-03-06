import "ol/ol.css";
import Map from 'ol/Map.js';
import TileLayer from 'ol/layer/WebGLTile.js';
import View from 'ol/View.js';
import XYZ from 'ol/source/XYZ.js';
import {fromLonLat} from 'ol/proj.js';
import ScaleLine from 'ol/control/ScaleLine.js';
import apply from 'ol-hashed';

const key = 'Sla0LBbfUvXVwh1Gu8j5'; // Replace with your own key
const attributions =
  '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

// band math operates on normalized values from 0-1
// so we scale by 255 to align with the elevation formula
// from https://cloud.maptiler.com/tiles/terrain-rgb/
const elevation = [
  '+',
  -10000,
  [
    '*',
    0.1 * 255,
    [
      '+',
      ['*', 256 * 256, ['band', 1]],
      ['+', ['*', 256, ['band', 2]], ['band', 3]],
    ],
  ],
];

const style = {
  variables: {
    elevation: 368,
  },
  color: [
    'case',
    // use the `elevation` style variable to determine the color
    ['<=', elevation, ['var', 'elevation']],
    [139, 212, 255, 1],
    [139, 212, 255, 0],
  ],
};

const layer = new TileLayer({
  opacity: 0.6,
  extent: [...fromLonLat([14, 46.5]), ...fromLonLat([14.83, 46.69])],
  source: new XYZ({
    url:
      'https://api.maptiler.com/tiles/terrain-rgb/{z}/{x}/{y}.png?key=' + key,
    tileSize: 512,
    maxZoom: 12,
  }),
  style: style,
});

const rawLayer = new TileLayer({
  opacity: 0.6,
  source: layer.getSource(),
  visible: false
});

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new XYZ({
        url: 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=' + key,
        attributions: attributions,
        tileSize: 512,
        maxZoom: 22,
      }),
    }),
    layer,
    rawLayer
  ],
  view: new View({
    center: fromLonLat([14.7545, 46.6376]),
    zoom: 13,
  }),
});
apply(map);
map.addControl(new ScaleLine());
map.on('pointermove', (event) => {
  const pixelData = layer.getData(event.pixel);
  let elevation = '';
  if (pixelData) {
    const [r, g, b] = Array.from(pixelData);
    elevation = (-10000 + ((r * 256 * 256 + g * 256 + b) * 0.1)).toFixed(0) + ' m';
  }
  map.getViewport().title = elevation;
});

const control = document.getElementById('level');
const output = document.getElementById('output');
const raw = document.getElementById('raw');
const listener = function () {
  output.innerText = control.value;
  layer.updateStyleVariables({elevation: parseFloat(control.value)});
};
control.addEventListener('input', listener);
control.addEventListener('change', listener);
raw.addEventListener('input', () => {
  if (raw.checked) {
    rawLayer.setVisible(true);
  } else {
    rawLayer.setVisible(false);
  }
});
output.innerText = control.value;
