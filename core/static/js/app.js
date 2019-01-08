$(document).foundation();

var originX, originY, radius;

var compass = $('#cir')
var arrow = document.getElementById('arrow')
var bearing = 0

function roundify(selector="#map") {
  let mapWidth = $(selector).width();
  $(selector).css({
    'height': mapWidth + 'px'
  });
  var mapOffset = $(selector).offset()
  radius = mapWidth / 2

  originX = mapOffset.left + radius
  originY = radius + mapOffset.top
  console.log(`x: ${originX}, y: ${originY}`)
  compass.attr('cx', originX.toString())
  compass.attr('cy', originY.toString())
  compass.attr('r', (radius * 1.1).toString())
  // arrow.attr('x1', originX.toString())
  // arrow.attr('y1', originY.toString())
  // arrow.attr('x2', originX.toString())
  // arrow.attr('y2', (originY - radius * 1.1).toString())
  // var hiddenArrow = `
  // <circle id="cir" cx=${originX.toString()} cy=${originY.toString()} r=${(radius * 1.1).toString()} stroke="green" fill="none" />
  // <g id="poopoo" style="stroke: black;">
  //   <line x1=${originX.toString()} y1=${originY.toString()} x2=${originX.toString()} y2=${(originY - radius * 1.1).toString()}/>
  //   <polygon points="${originX} ${originY - radius * 1.1 - 5}, ${originX - 5} ${originY - radius * 1.1 + 5}, ${originX + 5} ${originY - radius * 1.1 + 5}"/>
  // </g>
  // <use href="#poopoo" transform="rotate(180, ${originX}, ${originY})"/>
  // `
  // arrow.html(hiddenArrow)
  arrowWidthMP = $('#arrow').width() / 2
  arrowHeightMP = $('#arrow').height() / 2
  console.log(arrow.style.width)
  arrow.style.cssText = `transform: rotate(${bearing}deg); transform-origin: ${originX}px ${originY}px; top: ${originY - arrowHeightMP - radius * 1.1}px; left: ${originX - arrowWidthMP}px;` 
}

$(document).ready(roundify())

$(window).resize(function () {
  roundify()
})

// setInterval(function() {
//   roundify('#map')
//   }, 500)