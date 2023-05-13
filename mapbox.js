mapboxgl.accessToken = 'API_KEY';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/avirads/clhk30xq501j001quhg3mdivz',
  center: [-87.661557, 41.893748],
  zoom: 10.7,
});

let marker;
let id = new Date().getTime();
let all_markers = {};
let color = Math.floor(Math.random() * 16777215).toString(16);
let lng, lat;
map.on('click', (event) => {
  lng = event.lngLat.lng;
  lat = event.lngLat.lat;
  all_markers[id] = new Array(id, color, lng, lat);
  sendMarker();
});

function addMarker(colour, longitude, latitude) {
  marker = new mapboxgl.Marker({
    color: `#${colour}`,
  });
  marker.setLngLat([longitude, latitude]);
  marker.addTo(map);
}

const map_socket_server = new WebSocket('ws://localhost:8080');

function sendMarker() {
  map_socket_server.send(`${id},${color},${lng},${lat}`);
}
map_socket_server.onmessage = (event) => {
  if (typeof event.data == 'object') {
    event.data.text().then((txt) => {
      const marker_data = txt.split(',');
      all_markers[marker_data[0]] = new Array(
        marker_data[0],
        marker_data[1],
        marker_data[2],
        marker_data[3]
      );
      for (const marker_item in all_markers) {
        console.log(all_markers[marker_item]);
        addMarker(
          all_markers[marker_item][1],
          all_markers[marker_item][2],
          all_markers[marker_item][3]
        );
      }
    });
  }
};
