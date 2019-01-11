$(document).foundation();

let originX, originY, radius;
let arrow = document.getElementById('arrow')
let viewpoint = document.getElementById('viewpoint')
let bearing = 0
let mapDiv = $('#map')


function roundify() {
  mapDiv.css({ 'height': mapDiv.width() + 'px' });
  radius = mapDiv.width() / 2
  originX = mapDiv.offset().left + radius
  originY = mapDiv.offset().top + radius
  viewpoint.style.cssText = `
    top: ${originY - radius * 1.05}px;
    left: ${originX + radius * 1.05}px;
  `
}

$(document).ready(function () {
  roundify()
})
$(window).resize(function () {
  roundify()
})

setInterval(getMySpot, 1000);

window.ondeviceorientationabsolute = function(event) {
  roundify()

  compassHeading = event.alpha

  $('#c-heading').text((compassHeading))
  $('#c-bearing').text((updatebearing))
  var finalHeading = compassHeading + updatebearing
  if (finalHeading > 360) { finalHeading -= 360}
  $('#c-finalheading').text((finalHeading))

  arrow.style.cssText = `
  transform: rotate(${(finalHeading)}deg);
  transform-origin: bottom center;
  height: ${radius + 60}px;
  padding-bottom: ${radius - 35}px;
  top: ${originY - 60 - radius}px;
  left: ${originX - 30}px;
`
  $('#viewpoint').css('transform', `rotate(compassHeading)deg`)
};

if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", function(event) {
    if (event.webkitCompassHeading) {
      roundify()

      compassHeading = event.webkitCompassHeading

      $('#c-heading').text((compassHeading))
      $('#c-bearing').text((updatebearing))
      var finalHeading = updatebearing - compassHeading 
      if (finalHeading < 0) { finalHeading += 360}
      $('#c-finalheading').text((finalHeading))

      {
        arrow.style.cssText = `
          transform: rotate(${(finalHeading)}deg);
          transform-origin: bottom center;
          height: ${radius + 60}px;
          padding-bottom: ${radius - 35}px;
          top: ${originY - 60 - radius}px;
          left: ${originX - 30}px;
        `
      }
    }
  })
}