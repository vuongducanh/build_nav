'use strict';

$(document).ready(function () {
  var hiddenName = 'hidden';

  var slickActiveClassName = '.slick-active';

  var $slick = $('.js-slider');

  function initSlider() {
    if ($slick.hasClass('slick-initialized')) {
      $slick.slick('unslick');
    }

    $slick.slick({
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: true
    });
  }

  initSlider();
});
//# sourceMappingURL=slider.js.map
