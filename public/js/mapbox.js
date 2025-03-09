/* eslint-disable */
console.log('Hello from the client side.');
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

const map = new mapboxgl.Map({
  container: 'map', // container ID
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 9, // starting zoom
});
