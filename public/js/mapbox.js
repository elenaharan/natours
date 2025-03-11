/* eslint-disable */

console.log('Hello from the client side.');

fetch('/api/mapbox-token')
  .then((response) => response.json())
  .then((data) => {
    if (!data.accessToken) {
      throw new Error('Mapbox token is missing!');
    }

    mapboxgl.accessToken = data.accessToken;

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/elena-js/cm82v5dfp00y601qs9ryg48zf/draft',
      center: [-73.946599, 40.637298],
      zoom: 9,
      interactive: false,
    });
  })
  .catch((err) => console.error('Error loading Mapbox:', err));
