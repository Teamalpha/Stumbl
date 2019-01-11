
let originX, originY, radius;
let arrow = document.getElementById('arrow')
let mapDiv = $('#map')
let cities = []

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

$('.open-pl-modal').click(function(event) {
  event.preventDefault()
  $.get("/api/playlists/", function(data){
    console.log(data)
    playlists = data
  }).then(() => {
    cities = getCities()
    $('#city-list').empty()
    for (let city of cities) {
      $('#city-list').append(`<div id="${city}">
      <button class="button is-primary">${city}
      </div>`)
      $(`#${city}`).click(function(event) {
        event.preventDefault()
        $.get(`/api/playlists/?search=${city}`, function(data){
          console.log(`Playlists in ${city}`, data)
          cityPlaylists = data
          $('#city-playlist-list').empty()
          for (let playlist of cityPlaylists) {
            $('#city-playlist-list').append(`<div id="${playlist.title}">
            <button class="button is-primary">${playlist.title}
            </div>`)
            $(`#${playlist}`).click(function(event) {
              event.preventDefault()
              $.get(`/api/playlists/${playlist.pk}`, function(data){
                
              })
            })
          }
          $('#city-playlists-modal').addClass('is-active')
        })
      })
    }
    $('#choose-city-modal').addClass('is-active')
  })
    .catch((err) => {
      console.log(err);
    })
})

function deleteButtonListener(buttonSelector, modalSelector) {
  $(buttonSelector).click(function() {
    $(modalSelector).removeClass('is-active')
  })
}

deleteButtonListener('#exit-city-playlists-modal', '#city-playlists-modal')
deleteButtonListener('#exit-choose-city-modal', '#choose-city-modal')
