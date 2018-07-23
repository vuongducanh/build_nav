'use strict';

$(document).ready(function () {
  var click = 0;
  $('.js-load-more').click(function (e) {
    click = click + 1;
    var self = $(this);
    var itemSelector = self.data('item-selector');
    var $allItems = $(itemSelector);

    var itemsPerPage = self.data('item-page');
    var maxDisplayedItemCount = self.data('max-item-count');
    var viewMoreLink = self.data('redirect-link');
    var totalItemCount = self.data('item-count');
    var linkText = self.data('link-text');

    var $hiddenItems = $(itemSelector + '.hidden');

    $hiddenItems.each(function (index) {
      if (index < itemsPerPage) {
        $(this).removeClass('hidden');
      }
    });

    var visibleItems = $(itemSelector + ':visible');
    var visibleItemsCount = visibleItems.length;

    if (visibleItemsCount === maxDisplayedItemCount && visibleItemsCount < totalItemCount && viewMoreLink) {
      if (linkText) {
        self.children().text(linkText);
      }
      self.attr('href', viewMoreLink);
      self.off('click');
      e.preventDefault();
    } else if (visibleItemsCount === $allItems.length) {
      self.hide();
    }
  });
});
//# sourceMappingURL=load-more-button.js.map
