/* eslint-disable */

console.log('Hello from the client side.');
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

async function getMapboxToken() {
  try {
    const response = await fetch('/api/mapbox-token');
    const data = await response.json();

    if (!data.accessToken) {
      throw new Error('Mapbox token is missing!');
    }

    return data.accessToken;
  } catch (error) {
    console.error('Error loading Mapbox token:', error);
    return null;
  }
}

function initializeMap(accessToken) {
  mapboxgl.accessToken = accessToken;

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/elena-js/cm82v5dfp00y601qs9ryg48zf/draft',
    scrollZoom: false,
    // center: [-73.946599, 40.637298],
    // zoom: 9,
    // interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add the marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current locations
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
}

async function init() {
  const accessToken = await getMapboxToken();
  if (accessToken) {
    initializeMap(accessToken);
  }
}

init();
