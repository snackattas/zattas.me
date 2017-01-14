$( document ).ready( function () {

  function scroller (event) {
    var scroll_to = event.data.scroll_to
    $('html,body').animate({
      scrollTop: $(scroll_to).offset().top
    }, 1000);
  }

  var menu_links = $(".button-link");

  for (i = 0; i < menu_links.length; i++) {
    var scroll_from = $(menu_links[i])
    var scroll_to = "#" + $(scroll_from).data("id")
    $(scroll_from).on("click", {scroll_to: scroll_to}, scroller)
  };
});
