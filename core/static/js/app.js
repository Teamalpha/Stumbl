let originX, originY, radius;
let arrow = document.getElementById('arrow')
let mapDiv = $('#map')
let stayCentered = true
let recenterButton = document.getElementById('recenter-button')
let coneOfFocus = document.getElementById('cone-of-focus')

function roundify() {
  mapDiv.css({ 'height': mapDiv.width() + 'px' });
  radius = mapDiv.width() / 2
  originX = mapDiv.offset().left + radius
  originY = mapDiv.offset().top + radius
  arrow.style.height = `${radius + 60}px`
  arrow.style.paddingBottom = `${radius - 35}px`
  arrow.style.top = `${originY - 60 - radius}px`
  arrow.style.left = `${originX - 30}px`
  recenterButton.style.top = `${originY - 20 - radius * .91}px`
  recenterButton.style.left = `${originX - 20 - radius * .91}px`
  recenterButton.style.display = 'inline-block'

  coneOfFocus.style.top = `${originY - 40 - radius * .91}px`
  coneOfFocus.style.left = `${originX - 40 + radius * .91}px`
  coneOfFocus.style.display = 'inline-block'
}

$(document).ready(function () { roundify() })
$(window).resize(function () { roundify() })
setInterval(getMySpot, 1000);

// Set compass arrow for Android Devices
window.ondeviceorientationabsolute = function (event) {
  compassHeading = event.alpha
  var finalHeading = compassHeading + updatebearing
  if (finalHeading > 360) { finalHeading -= 360 }

  roundify()
  coneOfFocus.style.transform = `rotate(${(360 - compassHeading)}deg)`
  arrow.style.transform = `rotate(${(finalHeading)}deg)`
};

// set compass arrow for iOs devices
if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", function (event) {
    if (event.webkitCompassHeading) {
      compassHeading = event.webkitCompassHeading
      var finalHeading = updatebearing - compassHeading
      if (finalHeading < 0) { finalHeading += 360 }

      roundify()
      coneOfFocus.style.transform = `rotate(${(compassHeading)}deg)`
      arrow.style.transform = `rotate(${(finalHeading)}deg)`;
    }
  })
}


$('.open-pl-modal').click(function () {
  $('#choose-city-modal').addClass('is-active')
})

function exitButtonListener(buttonSelector, modalSelector) {
  $(buttonSelector).click(function () {
    $(modalSelector).removeClass('is-active')
  })
}

exitButtonListener('#exit-city-playlists-modal', '#city-playlists-modal')
exitButtonListener('#exit-choose-city-modal', '#choose-city-modal')
exitButtonListener('#exit-playlist-detail-modal', '#playlist-detail-modal')
exitButtonListener('#exit-create-playlist-modal', '#create-playlist-modal')
exitButtonListener('#exit-edit-playlist-modal', '#edit-playlist-modal')
exitButtonListener('#exit-duplicate-playlist-modal', '#duplicate-playlist-modal')
exitButtonListener('#exit-confirm-delete-playlist-modal', '#confirm-delete-playlist-modal')
exitButtonListener('#exit-duplicate-destination-modal', '#duplicate-destination-modal')
exitButtonListener('#exit-active-playlists-modal', '#active-playlists-modal')
exitButtonListener('#exit-playlist-already-applied-modal', '#playlist-already-applied-modal')
exitButtonListener('#exit-about-modal', '#about-modal')

function capitalize(word) {
  capitalizedWord = word[0].toUpperCase() + word.slice(1).toLowerCase()
  return capitalizedWord
}