'use strict';

var active = 'open';
var duration = 600;

$(document).ready(function () {
  $('.js-nav-dropdown').hover(function () {
    $(this).addClass(active);
    $(this).find('.js-nav-dropdown-menu').stop(true, true).slideDown(duration);
  }, function () {
    $(this).removeClass(active);
    $(this).find('.js-nav-dropdown-menu').stop(true, true).slideUp(duration);
  });

  var hash = window.location.hash;
  hash && $('ul.nav a[href="' + hash + '"]').tab('show');

  $('.nav-tabs a').click(function (e) {
    $(this).tab('show');

    window.location.hash = this.hash;

    var scrollTop = $('body').scrollTop() || $('html').scrollTop();
    $('html,body').scrollTop(scrollTop);
  });

  $('.js-dropdown').on('shown.bs.dropdown', function () {
    $('.js-tab-selector').addClass('active');
  });

  $('.js-dropdown').on('hide.bs.dropdown', function () {
    $('.js-tab-selector').removeClass('active');
  });

  // Need this for Safari to work
  $('.js-dropdown').on('click', function () {});

  $('.js-tab-selector-item').on('click', function () {
    var self = $(this);
    window.location.hash = this.hash;
    updateSelector(self);
  });

  $('.js-tab-click').on('click', function () {
    var self = $(this);
    var tabId = self.data('associated-tab');
    var tabSelectorItem = $('.js-tab-selector-item[data-associated-tab="' + tabId + '"]');
    updateSelector(tabSelectorItem);
  });

  function updateSelector(self) {
    var selector = self.closest('.js-dropdown').find('.js-tab-selector');
    var selectorHtml = selector.html();
    var selectorText = selector.text().replace(/[^\w\s]/gi, '').replace(/\r?\n|\r/gi, '').trim();
    selectorHtml = selectorHtml.replace(selectorText, '');
    selectorHtml = self.text() + selectorHtml;

    selector.html(selectorHtml);
  }
});
//# sourceMappingURL=navigation.js.map
