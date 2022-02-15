//first initialize the map as a global valuable//
let map;

$(document).ready(() => {
  fetchMap();
});

// Add a new marker to map on click
const addNewMarker = (position) => {
  const marker = new google.maps.Marker({
    position,
    map
  })
};

//Load fullsize google map//
const loadMap = (mapData) => {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: mapData.avg_lat, lng: mapData.avg_lng },
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
  });

  map.addListener('click', (event) => {
    addNewMarker(event.latLng);
  })
};

//For google map pins//
const mapPins = (pin) => {
  // console.log(pin);
  const marker = new google.maps.Marker({
    position: { lat: pin.lat, lng: pin.lng },
    map: map,
  });

  const infowindow = new google.maps.InfoWindow({
    content: `<h3>${pin.title}</h3>
              <img src='${pin.image_url}'>
              <p>${pin.description}</p>
             `,
  });

  marker.addListener("click", () => {
    infowindow.open({
      anchor: marker,
      map,
    });
  });
};

//create HTML skeleton//
const createMapElement = (map) => {
  const mapName = map.name;
  const mapDesc = map.description;
  const $map = `
    <section id="list-of-locations">
      <a id="back-to-maps" href="/">Back to maps</a>
      <h2>${mapName}</h2>
      <p>${mapDesc}</p>
      <ul class='pin-list'>
      </ul>
    </section>

    <div id="map-buttons">
      <button class="add-marker">Add</button>
      <button class="share-btn">Share</button>
    </div>
 `;
  return $map;
};

//get mapid from route/
const pathname = window.location.pathname;
const mapId = pathname.split("/")[2];

const fetchMap = () => {
  $.get(`/maps/api/${mapId}`).then((map) => renderMap(map));
};

const renderMap = function (map) {
  const fetchPins = (mapId) => {
    $.get(`/pins/${mapId}`).then((pins) => {
      renderPins(pins);
    });
  };

  const renderPins = (pins) => {
    for (const pin of pins) {
      mapPins(pin);

      $(".pin-list").prepend(`<li>${pin.title}</li>`);
    }
  };

  loadMap(map);
  fetchPins(map.id);

  $("#floating-menu").empty();
  const $map = createMapElement(map);
  $("#floating-menu").append($map);
};

//
