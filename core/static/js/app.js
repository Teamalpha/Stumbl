$(document).foundation();

var originX, originY, radius;

var compass = $('#cir')

// $( "*", document.body ).click(function( event ) {
//   var offset = $( this ).offset();
//   event.stopPropagation();
//   $( "#result" ).text( this.tagName +
//     " coords ( " + offset.left + ", " + offset.top + " )" );
// });

function roundify(selector="#map") {
  let mapWidth = $(selector).width();
  $(selector).css({
    'height': mapWidth + 'px'
  });
  var mapOffset = $(selector).offset()
  console.log($("#map").offset())
  radius = mapWidth / 2
  console.log(`offset -- x: ${mapOffset.left}, y: ${mapOffset.top}, r: ${radius}`)
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
  console.log('body width: ', $('body').width())
}

$(document).ready(roundify())

$(window).resize(function () {
  roundify()
})

// setInterval(function() {
//   roundify('#map')
//   }, 500)