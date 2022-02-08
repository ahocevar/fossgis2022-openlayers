import 'ol/ol.css';
import GeoTIFF from 'ol/source/GeoTIFF.js';
import Map from 'ol/Map.js';
import TileGrid from 'ol/tilegrid/TileGrid.js';
import View from 'ol/View.js';
import WebGLTileLayer from 'ol/layer/WebGLTile.js';
import {sourcesFromTileGrid} from 'ol/source.js';
import DataTileSource from 'ol/source/DataTile';

// Metadata from https://s2downloads.eox.at/demo/EOxCloudless/2019/rgb/2019_EOxCloudless_rgb.json

// Tile grid of the GeoTIFF pyramid layout
const tileGrid = new TileGrid({
  extent: [-180, -90, 180, 90],
  resolutions: [0.703125, 0.3515625, 0.17578125, 8.7890625e-2, 4.39453125e-2],
  tileSizes: [
    [512, 256],
    [1024, 512],
    [2048, 1024],
    [4096, 2048],
    [4096, 4096],
  ],
});

const pyramid = new WebGLTileLayer({
  sources: sourcesFromTileGrid(
    tileGrid,
    ([z, x, y]) =>
      new GeoTIFF({
        sources: [
          {
            url: `https://s2downloads.eox.at/demo/EOxCloudless/2019/rgb/${z}/${y}/${x}.tif`,
          },
        ],
      })
  ),
});

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

const gridinfo = new WebGLTileLayer({
  sources: sourcesFromTileGrid(
    tileGrid,
    ([z, x, y]) =>
      new DataTileSource({
        interpolate: true,
        projection: 'EPSG:4326',
        tileGrid: tileGrid,
        loader: function (z, x, y) {
          const [width, height] = tileGrid.getTileSize(z);
          if (width !== canvas.width || height !== canvas.height) {
            canvas.width = width;
            canvas.height = height;
            context.strokeStyle = 'white';
            context.textAlign = 'center';
            context.font = '120px sans-serif';
            context.fillStyle = 'black';
          } else {
            context.clearRect(0, 0, width, height);
          }
          context.fillText(`${z}/${y}/${x}.tif`, width / 2, height / 2 + 30);
          context.strokeText(`${z}/${y}/${x}.tif`, width / 2, height / 2 + 30);
          context.strokeRect(0, 0, width, height);
          const data = context.getImageData(0, 0, width, height).data;
          // converting to Uint8Array for increased browser compatibility
          return new Uint8Array(data.buffer);
        },
        // disable opacity transition to avoid overlapping labels during tile loading
        transition: 0,
      })
  )
});

const map = new Map({
  target: 'map',
  layers: [pyramid, gridinfo],
  view: new View({
    projection: 'EPSG:4326',
    center: [0, 0],
    zoom: 1,
    multiWorld: true
  }),
});
