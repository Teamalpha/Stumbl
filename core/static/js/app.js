$(document).foundation();

let originX, originY, radius;
let arrow = document.getElementById('arrow')
let bearing = 0
let mapDiv = $('#map')

function roundify() {
  mapDiv.css({ 'height': mapDiv.width() + 'px' });
  radius = mapDiv.width() / 2
  originX = mapDiv.offset().left + radius
  originY = mapDiv.offset().top + radius
  // arrow.style.cssText = `
  //   transform: rotate(${updatebearing}deg);
  //   transform-origin: bottom center;
  //   height: ${radius + 60}px;
  //   padding-bottom: ${radius - 35}px;
  //   top: ${originY - 60 - radius}px;
  //   left: ${originX - 30}px;
  //   display: inline-block;
  // ` 
}

$(document).ready(function () {
  roundify()
})
$(window).resize(function () {
  roundify()
})

setInterval(getMySpot, 1000);

// Obtain a new *world-oriented* Full Tilt JS DeviceOrientation Promise
var promise = FULLTILT.getDeviceOrientation({ 'type': 'world' });

// Wait for Promise result
promise.then(function (deviceOrientation) { // Device Orientation Events are supported

  // Register a callback to run every time a new 
  // deviceorientation event is fired by the browser.
  deviceOrientation.listen(function () {

    // Get the current *screen-adjusted* device orientation angles
    var currentOrientation = deviceOrientation.getScreenAdjustedEuler();

    // Calculate the current compass heading that the user is 'looking at' (in degrees)
    // var compassHeading = currentOrientation.alpha - 360;
    $('#c-heading').text((currentOrientation.alpha))
    $('#c-bearing').text((updatebearing))
    var finalHeading = compassHeading - updatebearing
    if (finalHeading < 0) { finalHeading += 360}
    $('#c-finalheading').text((finalHeading))

    arrow.style.cssText = `
      transform: rotate(${(finalHeading)}deg);
      transform-origin: bottom center;
      height: ${radius + 60}px;
      padding-bottom: ${radius - 35}px;
      top: ${originY - 60 - radius}px;
      left: ${originX - 30}px;
      display: inline-block;
    `
    // Do something with `compassHeading` here...

  });

}).catch(function (errorMessage) { // Device Orientation Events are not supported

  console.log(errorMessage);

  // Implement some fallback controls here...

});

window.ondeviceorientationabsolute = function(event) {
  compassHeading = event.alpha
  $('#c-heading').text((compassHeading))
  $('#c-bearing').text((updatebearing))
  var finalHeading = compassHeading - updatebearing
  if (finalHeading < 0) { finalHeading += 360}
  $('#c-finalheading').text((finalHeading))

  arrow.style.cssText = `
  transform: rotate(${(finalHeading)}deg);
  transform-origin: bottom center;
  height: ${radius + 60}px;
  padding-bottom: ${radius - 35}px;
  top: ${originY - 60 - radius}px;
  left: ${originX - 30}px;
  display: inline-block;
`
};