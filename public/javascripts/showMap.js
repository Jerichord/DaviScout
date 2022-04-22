mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: restaurant.geometry.coordinates, // starting position [lng, lat]
  zoom: 17, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

const marker = new mapboxgl.Marker()
  .setLngLat(restaurant.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h5>${restaurant.name}</h5><p>${restaurant.location}</p>`
    )
  )
  .addTo(map);
