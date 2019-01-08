$(document).foundation();

var originX, originY, radius;

var compass = $('#cir')

function roundify(selector="#map") {
  let mapWidth = $(selector).width();
  $(selector).css({
    'height': mapWidth + 'px'
  });
  var mapOffset = $(selector).offset()
  radius = mapWidth / 2
  console.log(`before -- x: ${mapOffset.left}, y: ${mapOffset.top}, r: ${radius}`)
  console.log('Map Width: ', mapWidth)
  console.log('Map Height: ', $(selector).height())

  originX = mapOffset.left + radius
  originY = radius + mapOffset.top
  console.log(`x: ${originX}, y: ${originY}`)
  compass.attr('cx', originX.toString())
  compass.attr('cy', originY.toString())
  compass.attr('r', (radius * 1.1).toString())
  console.log('radius: ', compass.attr('r'))
  console.log('x: ', compass.attr('cx'))
  console.log('y: ', compass.attr('cy'))
}

$(document).ready(roundify())

$(window).resize(function () {
  roundify()
})



// setInterval(function() {
//   roundify('#map')
//   }, 500)