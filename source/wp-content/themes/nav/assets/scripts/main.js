/* eslint no-invalid-regexp: "off" */
'use strict';

var breakPointTablet = 768;

window.isMobile = function () {
  return window.innerWidth < breakPointTablet;
};

/* Document Ready */

$(document).ready(function () {
  var $w = $(window),
      $h = $('html'),
      $b = $('body'),
      $scope = $('html');

  function home_resize_callback() {
    //tasks to do when resizing
    DBSNAV.Sections.update();
    console.log('resize');
  }

  function home_scroll_callback() {
    //tasks to do when scrolling
    var newTop = $(document).scrollTop();
    DBSNAV.Sections.updateScrollPos(newTop);
    DBSNAV.Sections.step();
  }

  /* Init page */
  var page = new DBSNAV.Page($h);
  var newTop = $(document).scrollTop();
  page.Init($h);

  if (page.Meta.ID == 'home') {

    DBSNAV.Animation.Init($scope);
    DBSNAV.Sections.Init();
    DBSNAV.Sections.update();

    setTimeout(function () {
      home_scroll_callback();
    }, 1000);

    $w.resize(DBSNAV.UTILS.throttle(home_resize_callback, 160));
    $w.scroll(DBSNAV.UTILS.throttle(home_scroll_callback, 400));
  }
});
//# sourceMappingURL=main.js.map
