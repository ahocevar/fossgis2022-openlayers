import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import MapboxVectorLayer from 'ol/layer/MapboxVector';
import apply from 'ol-hashed';

const key = 'Sla0LBbfUvXVwh1Gu8j5'; // Replace with your own key

const map = new Map({
  target: 'map',
  layers: [
    new MapboxVectorLayer({
      styleUrl: 'https://api.maptiler.com/maps/streets/style.json?key=' + key
    })
  ],
  view: new View({
    center: fromLonLat([8.77, 50.8149]),
    zoom: 16,
  })
});

apply(map);