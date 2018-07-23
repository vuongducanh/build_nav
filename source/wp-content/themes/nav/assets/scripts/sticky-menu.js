'use strict';

$(document).ready(function () {
  var activeClass = 'active';
  var stickyMenu = 'js-sticky-menu:visible';

  var $header = $('.js-header');
  var $stickyLinks = $('.js-sticky-link');

  var $footer = $('.js-footer');

  var currentOffsetTop = void 0;

  $('.js-tab-click').on('click', function () {
    setTimeout(function () {
      stickyToFooter();
    }, 100);
  });

  function overlayStickyMenu() {
    var scrollTop = $(window).scrollTop();

    if (scrollTop > currentOffsetTop) {
      $('.' + stickyMenu).addClass(activeClass);
    } else {
      $('.' + stickyMenu).removeClass(activeClass);
    }
  }

  function updateCurrentOffsetTop() {
    currentOffsetTop = $('.' + stickyMenu).hasClass(activeClass) ? currentOffsetTop : $('.' + stickyMenu).offset().top - $header.height();
  }

  function stickyToFooter() {
    var stickyMenuEl = $('.' + stickyMenu);
    if (!stickyMenuEl.hasClass(activeClass)) {
      return;
    }

    var windowHeight = window.innerHeight;
    var footerPosition = $footer.offset().top;
    var isFooterVisible = $(window).scrollTop() + windowHeight >= footerPosition;

    stickyMenuEl.css('bottom', isFooterVisible ? $(window).scrollTop() + windowHeight - footerPosition + 'px' : '0');
  }

  function clearExpandStickyItem() {
    $stickyLinks.removeClass(activeClass);
  }

  function handleWindowScroll() {
    if (!$('.' + stickyMenu).length) {
      return;
    }

    overlayStickyMenu();
    updateCurrentOffsetTop();
    clearExpandStickyItem();
    stickyToFooter();
  }

  if ($('.' + stickyMenu).length) {
    updateCurrentOffsetTop();

    $(window).on('scroll', handleWindowScroll);

    $(window).on('resize', handleWindowScroll);

    $stickyLinks.on('click', function (e) {
      if (!window.isMobile() || $(this).hasClass(activeClass)) {
        return true;
      }

      $stickyLinks.removeClass(activeClass);

      $(this).addClass(activeClass);

      e.preventDefault();
    });
  }
});
//# sourceMappingURL=sticky-menu.js.map
