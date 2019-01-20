$('#how-to').click(function() {
    $('#nav-check').prop('checked', false)
    $('#about-modal').addClass('is-active')
  })
  
  $(window).mouseup(function(event) {
    let nav = $('#nav-links')
    if (event.target !== nav && event.target.parentNode !== nav) {
      $('#nav-check').prop('checked', false)
    }
  })