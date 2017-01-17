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

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-90308284-1', 'auto');
  ga('send', 'pageview');
});

window.onload = function() {
  $('.header-video').append("<video autoplay='' class='header-video__media' loop=''><source src='static/video/coding-smaller.mp4' type='video/mp4'><source src='static/video/coding.ogv' type='video/ogv'/><source src='static/video/coding.webm' type='video/webm'/>Sorry, your browser doesn't support HTML5 video.</video>");
};
