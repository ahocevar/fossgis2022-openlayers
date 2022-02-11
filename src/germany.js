import 'ol/ol.css';
import GeoTIFF from 'ol/source/GeoTIFF';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/WebGLTile';

const source = new GeoTIFF({
  normalize: false, // keep original indices
  sources: [
    {
      url: 'https://data.mundialis.de/geodata/lulc-germany/classification_2020/classification_map_germany_2020_v02.tif',
    },
    {
      url: 'https://data.mundialis.de/geodata/lulc-germany/classification_2016/classification_map_germany_2016_v0_1.tif',
    }
  ]
});
source.setAttributions('&copy; <a href="https://www.mundialis.de/">mundialis</a> dl-by-de/2.0, <a href="https://data.mundialis.de/geonetwork/srv/eng/catalog.search#/metadata/db130a09-fc2e-421d-95e2-1575e7c4b45c">2016</a>, <a href="https://data.mundialis.de/geonetwork/srv/eng/catalog.search#/metadata/9246503f-6adf-460b-a31e-73a649182d07">2020</a>')

const classes = {
  '10': 'forest',
  '20': 'low vegetation',
  '30': 'water',
  '40': 'built-up',
  '50': 'bare soil',
  '60': 'agriculture'
}

const makeStyle = (year) => {
  if (year == 'diff') {
    return {
      color: [
        'case',
        ['==', ['band', 1], ['band', 2]],
        [0, 0, 0, 0], // equal
        [255, 165, 0, 0.8] // different
      ],
    };
  }
  const bandNumber = year === '2020' ? 1 : 2;
  return {
    color: [
      'interpolate',
      ['linear'],
      ['band', bandNumber],
      0, [0, 0, 0, 0],
      10, [4, 135, 29],
      20, [137, 222, 137],
      30, [14, 10, 214],
      40, [229, 109, 109],
      50, [180, 180, 77],
      60, [231, 231, 25],
      255, [0, 0, 0, 0]
    ],
    // color: [ // not satistying, why?
    //   'match',
    //   ['band', bandNumber],
    //   0, [0, 0, 0, 0],
    //   10, [4, 135, 29],
    //   20, [137, 222, 137],
    //   30, [14, 10, 214],
    //   40, [229, 109, 109],
    //   50, [180, 180, 77],
    //   60, [231, 231, 25],
    //   [0, 0, 0, 0]
    // ],
  }
}

const layer = new TileLayer({
  style: makeStyle('2020'),
  source: source,
});

const map = new Map({
  target: 'map',
  layers: [layer],
  view: source.getView()
});


const output = document.getElementById('output');
function displayPixelValue(event) {
  const data = layer.getData(event.pixel);
  if (!data) {
    return;
  }
  let txt = '';
  if (data[0] && data[1]) {
    if (data[0] !== data[1]) {
      txt = `Change | 2016: ${classes[data[1]]} => 2020: ${classes[data[0]]}`;
    } else {
      txt = `Unchanged | 2016 & 2020: ${classes[data[0]]}`;
    }
  }
  output.textContent = txt;
}
map.on(['pointermove', 'click'], displayPixelValue);

const yearSelector = document.getElementById('year');
yearSelector.addEventListener('change', () => {
  let newStyle = makeStyle(yearSelector.value);
  layer.setStyle(newStyle);
});
