$(document).foundation();

let originX, originY, radius;
let arrow = document.getElementById('arrow')
let mapDiv = $('#map')

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