$(document).foundation();

const apikey = config.API_KEY;

var map;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 8
        });
    }

if (typeof Gyroscope === "function") {
    console.log('The gyroscope is maybe possibly working??? ')
}

let magSensor = new Magnetometer({frequency: 60});

magSensor.addEventListener('reading', e => {
  console.log("Magnetic field along the X-axis " + magSensor.x);
  console.log("Magnetic field along the Y-axis " + magSensor.y);
  console.log("Magnetic field along the Z-axis " + magSensor.z);
  console.log(e)
})
magSensor.addEventListener('error', event => {
  console.log(event.error.name, event.error.message);
})
magSensor.start();

navigator.permissions.query({name:'geolocation'}).then(function(result) {
    if (result.state == 'granted') {
      console.log('Hooray we have access!');
    } else if (result.state == 'prompt') {
      console.log('so sad, no permissions')
    }
    // Don't do anything if the permission was denied.
  });