$(document).foundation();

// var apikey = config.API_KEY;





function roundify(selector = "#map") {
  let mapWidth = $(selector).width();
  $(selector).css({
    'height': mapWidth + 'px'
  });
}

$(document).ready(roundify('#map'))

$(window).resize(function () {
  let mapWidth = $('#map').width();
  $('#map').css({
    'height': mapWidth + 'px'
  });
})

navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
  if (result.state == 'granted') {
    console.log('Hooray we have access!');
  } else if (result.state == 'prompt') {
    console.log('so sad, no permissions')
  }
  // Don't do anything if the permission was denied.
});