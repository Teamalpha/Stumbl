$('#how-to').click(function() {
    $('#nav-check').prop('checked', false)
    $('#about-modal').addClass('is-active')
  })
  
  $(window).mouseup(function(event) {
    let nav = $('#nav-links')
    console.log(event.target)
    if (event.target !== nav && event.target.parentNode !== nav) {
      $('#nav-check').prop('checked', false)
      nav.hide()
    }
  })