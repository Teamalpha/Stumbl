$(document).foundation();

function roundify(selector="#map") {
  let mapWidth = $(selector).width();
  $(selector).css({
    'height': mapWidth + 'px'
  });
  var mapOffset = $(selector).offset()
  var radius = mapWidth / 2
  var originX = mapOffset.top + radius
  var originY = mapOffset.left + radius
  console.log(`x: ${originX}, y: ${originY}`)
}

$(document).ready(roundify())

$(window).resize(function () {
  roundify()
})


// setInterval(function() {
//   roundify('#map')
//   }, 500)