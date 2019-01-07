$(document).foundation();

function roundify(selector = "#map") {
  let mapWidth = $(selector).width();
  $(selector).css({
    'height': mapWidth + 'px'
  });
}

$(document).ready(roundify('#map'))

$(window).resize(function () {
  let mapWidth = $('#map').width();
  $('#map').css({
    'height': mapWidth + 'px'
  });
})
