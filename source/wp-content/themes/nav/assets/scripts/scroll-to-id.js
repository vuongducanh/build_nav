'use strict';

$(document).ready(function () {

  var hash = window.location.hash;

  if (hash) {
    var tabButton = $('.js-tab-click[href=\'' + hash + '\']');
    if (tabButton.length) {
      setTimeout(function () {
        window.scrollTo(0, 0);
      }, 1);

      tabButton.click();
    } else if (hash) {
      scrollToId(hash);
    }
  }

  $('.js-scroll-to-id').on('click', function (event) {
    event.preventDefault();
    scrollToId($(this).prop('hash'));
    return false;
  });

  function scrollToId(hashId) {
    var stickyMenu = $('.js-sticky-menu');
    var stickyMenuIsActive = stickyMenu.length > 0 && stickyMenu.hasClass('active');
    var offset = stickyMenuIsActive ? stickyMenu.outerHeight(true) : 0;

    var destination = $(hashId).offset().top - offset;

    $('html, body').animate({ scrollTop: destination }, 500);
  }
});
//# sourceMappingURL=scroll-to-id.js.map
