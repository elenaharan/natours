export const displayMap = (locations) => {
  mapboxgl.accessToken = 'pk.eyJ1IjoiZWxlbmEtanMiLCJhIjoiY204MnVid2V0MWplYzJrczVmN2EwN3hvZSJ9.JeJFEUY_8j4xqlU7z-Wnyw'

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
