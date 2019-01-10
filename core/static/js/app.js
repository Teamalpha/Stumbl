$(document).foundation();

let originX, originY, radius;
let arrow = document.getElementById('arrow')
let bearing = 0
let mapDiv = $('#map')

function roundify() {
  mapDiv.css({'height': mapDiv.width() + 'px'});
  radius = mapDiv.width() / 2
  originX = mapDiv.offset().left + radius
  originY = mapDiv.offset().top + radius
  arrow.style.cssText = `
    transform: rotate(${$(this).children('.slider-handle').attr('aria-valuenow')}deg);
    transform-origin: bottom center;
    height: ${radius + 60}px;
    padding-bottom: ${radius - 35}px;
    top: ${originY - 60 - radius}px;
    left: ${originX - 30}px;
    display: inline-block;
  ` 
}

$(document).ready(function() {
  roundify()
})
$(window).resize(function () {
  roundify()
})

$('.slider').on('moved.zf.slider', function(){
  let degrees = 
  arrow.style.cssText = `
    transform: rotate(${$(this).children('.slider-handle').attr('aria-valuenow')}deg);
    transform-origin: bottom center;
    height: ${radius + 60}px;
    padding-bottom: ${radius - 35}px;
    top: ${originY - 60 - radius}px;
    left: ${originX - 30}px;
    display: inline-block;
    `
});


$('[data-toggle-menu]').on("click", function(){
  $("#overlay-nav-menu").toggleClass("is-open");
});




// setInterval(function() {
//   roundify('#map')
//   }, 500)