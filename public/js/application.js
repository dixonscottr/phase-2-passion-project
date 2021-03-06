const lightbox = document.querySelector('#lightbox');
const closeButton = document.querySelector('#close-button')
const links = document.querySelectorAll(".get-drone-info");

closeLightBox = () => (lightbox.style.display = 'none');

links.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    lightbox.style.display = 'block';
    const url = link.attributes.href.value

    $.ajax({
      url: url,
      method: 'GET'
    })
    .done( (res) => {
      const lightboxContent = document.querySelector('#lightbox-content');
      lightboxContent.innerHTML = res;
    });
  }, false);
});
if(closeButton) {
  closeButton.addEventListener('click', closeLightBox); 
}

// filter button logic

const yearButtons = document.querySelectorAll('a.year-button');
const countryButtons = document.querySelectorAll('a.country-button');
const cards = [...document.querySelectorAll('div.card')];

const selectYear = (year) => {
  cards.forEach(card => {
    let cardYear = card.firstChild.nextElementSibling.children[0].innerText.split('-')[0];
    if(Number(cardYear) !== Number(year)) {
      card.classList.add('hidden');
    } else {
      card.classList.remove('hidden');
    }
  })
}

const selectCountry = (country) => {
  cards.forEach(card => {
    let cardCountry = card.firstChild.nextElementSibling.children[1].innerText.split(' |')[0]
    if(country !== cardCountry) {
      card.classList.add('hidden');
    } else {
      card.classList.remove('hidden');
    }
  })
}

yearButtons.forEach(year => {
  const y = year.innerText;
  year.addEventListener('click', selectYear.bind(null, y));
});
countryButtons.forEach(country => {
  const c = country.innerText;
  country.addEventListener('click', selectCountry.bind(null, c));
});

// JS for google maps

function mapStrikes(strikes_json) {
  infoWindow = new google.maps.InfoWindow({
    minWidth : 300
  });
  var strikes = [];
  strikes_json.forEach(function(strike) {
    var strikePos = strike.strike_position;
    if(strikePos.lat && strikePos.lng) {
      var marker = new google.maps.Marker({
      position: strikePos,
      map: map,
      icon: {
        path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW,
        fillColor: 'red',
        fillOpacity: 0.5,
        scale: 3,
        strokeColor: 'maroon',
        strokeWeight: 1
      },
      label: strike.bureau_id,
      date: strike.date,
      deaths: strike.deaths,
      location: strike.location,
      child_deaths: strike.child_deaths,
      country: strike.country
    });
    marker.addListener('click', function() {
      showStrikeInfo(marker);
    })
    strikes.push(marker);
    }
  })
  return strikes;
}

function showStrikeInfo(marker) {
  var casualties;
  marker.deaths ? casualties=marker.deaths : casualties=0
  if(casualties == 1) {
    casualties += " death"
  }
  else {
    casualties += " deaths"
  }
  if(marker.child_deaths) {
    casualties += ` (${marker.child_deaths} children)`
  }
  var location;
  marker.location ? location=`${marker.location}, ${marker.country}` : location=marker.country
  var msg1 = `<p class='center-align'>${location} </h5>`
  var msg2 = `<p class='center-align'>Casualties: ${casualties} </h5>`
  infoWindow.setContent("<div class='info-window'>" + msg1 + msg2 + "</div>");
  infoWindow.open(map, marker)
}

var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 19.445, lng: 59.578},
    zoom: 4,
    styles: style 
  });
}

var style = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#523735"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#c9b2a6"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#dcd2be"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ae9e90"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#93817c"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#a5b076"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#447530"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#fdfcf8"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f8c967"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#e9bc62"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e98d58"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#db8555"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#806b63"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8f7d77"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#b9d3c2"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#92998d"
      }
    ]
  }
]