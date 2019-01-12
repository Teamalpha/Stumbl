
let originX, originY, radius, flag;
let arrow = document.getElementById('arrow')
let mapDiv = $('#map')
let cities = []
let cityPlaylists = []
let destinations = []

function roundify() {
  mapDiv.css({ 'height': mapDiv.width() + 'px' });
  radius = mapDiv.width() / 2
  originX = mapDiv.offset().left + radius
  originY = mapDiv.offset().top + radius
  arrow.style.height = `${radius + 60}px`
  arrow.style.paddingBottom = `${radius - 35}px`
  arrow.style.top = `${originY - 60 - radius}px`
  arrow.style.left = `${originX - 30}px`
}

$(document).ready(function () {
  roundify()
})
$(window).resize(function () {
  roundify()
})

setInterval(getMySpot, 200);

// Set compass arrow for Android Devices
window.ondeviceorientationabsolute = function(event) {
  compassHeading = event.alpha
  var finalHeading = compassHeading + updatebearing
  if (finalHeading > 360) { finalHeading -= 360}
  $('#c-heading').text(`Absolute direction: ${compassHeading}`)
  $('#c-bearing').text(`Destination_______: ${updatebearing}`)
  $('#c-finalheading').text(`Final Destination : ${finalHeading}`)

  roundify()
  arrow.style.transform = `rotate(${(finalHeading)}deg)`
};

// set compass arrow for iOs devices
if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", function(event) {
    if (event.webkitCompassHeading) {
      roundify()
      compassHeading = event.webkitCompassHeading
      var finalHeading = updatebearing - compassHeading 
      if (finalHeading < 0) { finalHeading += 360}
      $('#c-heading').text(`Absolute direction: ${compassHeading}`)
      $('#c-bearing').text(`Destination_______: ${updatebearing}`)
      $('#c-finalheading').text(`Final Destination : ${finalHeading}`)

      arrow.style.transform = `rotate(${(finalHeading)}deg)`;
    }
  })
}

function getCities() {
  for (let playlist of playlists) {
    if (!cities.includes(playlist.city)) {
      cities.push(playlist.city)
    }
  }
  return cities
}

$('.open-pl-modal').click(function() {
  $.get("/api/playlists/", function(data){
    playlists = data
  }).then(() => {
    cities = getCities()
    $('#city-list').empty()
    // Generate list of cities
    for (let city of cities) {
      $('#city-list').append(`<div><button id="${city}" class="button is-primary">${city}</button></div>`)
      // click handler for city
      $(`#${city}`).click(function() {
        $.get(`/api/playlists/?search=${city}`, function(data) {
          cityPlaylists = data
        }).then(() => {
          $('#city-playlists').empty()
          // Generate list of playlists
          for (let playlist of cityPlaylists) {
            $('#city-playlists').append(`<div><button id="${playlist.title}" class="button is-primary">${playlist.title}</button></div>`)
            // flag = true
            // console.log(flag)
            // // click handler for playlist
            // $(`#${playlist.title}`).click(function() {
            //   alert(playlist.pk)
            //   $.get(`/api/playlists/${playlist.pk}`, function(data) {
            //     destinations = data
            //     console.log('playlist clicked!')
            //   }).then(() => {
            //     $('#playlist-detail').empty()
            //     // Generate list of destinations
            //     for (let destination of destinations) {
            //       $('#playlist-detail').append(`<div><button id="${destination.name}" class="button is-primary">${destination.name}</button></div>`)
            //     }
            //     $('#playlist-detail-modal').addClass('is-active')
            //   })
            // })
          }
          $('#city-playlists-modal').addClass('is-active')
        })
      })
    }
    $('#choose-city-modal').addClass('is-active')
  })
})

function exitButtonListener(buttonSelector, modalSelector) {
  $(buttonSelector).click(function() {
    $(modalSelector).removeClass('is-active')
  })
}

exitButtonListener('#exit-city-playlists-modal', '#city-playlists-modal')
exitButtonListener('#exit-choose-city-modal', '#choose-city-modal')
exitButtonListener('#exit-playlist-detail-modal', '#playlist-detail-modal')

// setInterval(function () {
// if (flag) {
//   for (let playlist of cityPlaylists) {
//     $(`#${playlist.title}`).click(function() {
//       console.log(`you clicked ! `)
//     })
//   }
//   console.log(cityPlaylists)
// flag = false
// }}, 1000)