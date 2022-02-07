import 'ol/ol.css';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Stamen from 'ol/source/Stamen';
import View from 'ol/View';
import { defaults as defaultInteractions, Modify } from 'ol/interaction';
import TileLayer from 'ol/layer/Tile';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import { getSquaredTolerance } from 'ol/renderer/Vector'

const radius = 10e6;
const cos30 = Math.cos(Math.PI / 6);
const sin30 = Math.sin(Math.PI / 6);
const rise = radius * sin30;
const run = radius * cos30;

const triangle = new LineString([
  [0, radius],
  [run, -rise],
  [-run, -rise],
  [0, radius],
]);

const feature = new Feature(triangle);

const layer = new VectorLayer({
  source: new VectorSource({
    features: [feature],
  }),
  style: [
    new Style({
      stroke: new Stroke({
        color: '#f00',
        width: 5,
      })
    })
  ]
});

const map = new Map({
  layers: [
    new TileLayer({
      source: new Stamen({
        layer: 'watercolor'
      }),
    }),
    layer],
  interactions: defaultInteractions({
    altShiftDragRotate: false,
    pinchRotate: false
  }),
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 1,
  }),
});

function makeFractal(depth) {
  const geometry = triangle.clone();
  const graph = coordsToGraph(geometry.getCoordinates());
  for (let i = 0; i < depth; ++i) {
    let node = graph;
    while (node.next) {
      const next = node.next;
      injectNodes(node);
      node = next;
    }
  }
  const coordinates = graphToCoords(graph);
  geometry.setCoordinates(coordinates);
  feature.setGeometry(geometry);
}

function injectNodes(startNode) {
  const endNode = startNode.next;

  const start = startNode.point;
  const end = startNode.next.point;
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];

  // first point at 1/3 along the segment
  const firstNode = {
    point: [start[0] + dx / 3, start[1] + dy / 3],
  };

  // second point at peak of _/\_
  const r = Math.sqrt(dx * dx + dy * dy) / (2 * cos30);
  const a = Math.atan2(dy, dx) + Math.PI / 6;
  const secondNode = {
    point: [start[0] + r * Math.cos(a), start[1] + r * Math.sin(a)],
  };

  // third point at 2/3 along the segment
  const thirdNode = {
    point: [end[0] - dx / 3, end[1] - dy / 3],
  };

  startNode.next = firstNode;
  firstNode.next = secondNode;
  secondNode.next = thirdNode;
  thirdNode.next = endNode;
}

function coordsToGraph(coordinates) {
  const graph = {
    point: coordinates[0],
  };
  const length = coordinates.length;
  for (let level = 0, node = graph; level < length - 1; ++level) {
    node.next = {
      point: coordinates[level + 1],
    };
    node = node.next;
  }
  return graph;
}

function graphToCoords(graph) {
  const coordinates = [graph.point];
  for (let node = graph, i = 1; node.next; node = node.next, ++i) {
    coordinates[i] = node.next.point;
  }
  return coordinates;
}

makeFractal(8);

const geometry = layer.getSource().getFeatures()[0].getGeometry();

function updateInfo() {
  const originalCount = geometry.getCoordinates().length;
  const simplifiedCount = geometry.getSimplifiedGeometry(
    getSquaredTolerance(map.getView().getResolution(), devicePixelRatio))
    .getCoordinates().length;
  const renderedCount = layer.getRenderer().replayGroup_ ?
    layer.getRenderer().replayGroup_
      .executorsByZIndex_[0]['LineString'].coordinates.length / 2 :
    'n/a';
  document.getElementById('count').innerHTML = `
    ${originalCount} points original<br>
    ${simplifiedCount} points simplified<br>
    ${renderedCount} points rendered`;
}
updateInfo();

const modify = new Modify({
  source: layer.getSource(),
});
map.addInteraction(modify);

modify.on('modifyend', updateInfo);
map.on('moveend', updateInfo);