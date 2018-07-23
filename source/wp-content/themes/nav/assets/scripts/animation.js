'use strict';

var DBSNAV = DBSNAV || {};

DBSNAV.UTILS = {
  throttle: function throttle(fn, wait) {
    var time = Date.now();

    return function () {
      if (time + wait - Date.now() < 0) {
        fn();
        time = Date.now();
      }
    };
  },
  detectIE: function detectIE() {
    /**
     * detect IE
     * returns version of IE or false, if browser is not Internet Explorer
     */

    var ua = window.navigator.userAgent;

    // Test values; Uncomment to check result …

    // IE 10
    // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

    // IE 11
    // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

    // Edge 12 (Spartan)
    // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

    // Edge 13
    // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      // IE 10 or older => return version number
      return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
      // IE 11 => return version number
      var rv = ua.indexOf('rv:');
      return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
  }
};

DBSNAV.Page = function () {
  this.Meta = {};

  this.Init = function ($el) {
    this.Meta.ID = $el.find('body').data('page');
  };
};

DBSNAV.Sections = {
  Init: function Init() {
    var _sections = this;
    _sections.updateScrollPos();
    _sections.update();
  },
  update: function update() {
    var section = $.map($('.block-section'), function (e) {
      var $e = $(e);
      var pos = $e.position();

      console.log(pos.top);

      return {
        $e: $e,
        top: pos.top,
        bottom: pos.top + $e.outerHeight(),
        hash: $e.data('section-name')
      };
    });

    this.section = section;
  },
  updateScrollPos: function updateScrollPos() {
    var _sections = this;
    var newTop = $(document).scrollTop();

    _sections.scrollTop = newTop;
    _sections.currentMiddle = newTop + window.innerHeight / 2;
  },
  step: function step(newTop) {
    var middle = DBSNAV.Sections.currentMiddle;
    var count = DBSNAV.Sections.section.length;
    var p = null;

    while (p = DBSNAV.Sections.section[--count]) {
      if (p.top >= middle || p.bottom <= middle) {
        continue;
      }
      break;
    }

    if (p === undefined) {
      p = DBSNAV.Sections.section[0];
    }

    if (p) {

      var $section = $('[data-section-name="' + p.hash + '"]');
      var path_progress_to = $section.data('path-progress');

      // Get animation progress value for this section
      if (path_progress_to > DBSNAV.Animation.scrolledToProgess) {
        DBSNAV.Animation.scrolledToProgess = path_progress_to;
      }

      console.log(p.hash, ', path-progress:', path_progress_to);
      // Trigger path animation
      DBSNAV.Animation.Start(path_progress_to);

      $section.find('.js-animated-item').removeClass('before-animate');
    }
  }
};

DBSNAV.Animation = {
  enabled: !DBSNAV.UTILS.detectIE(),
  svgs: {},
  scrolledToProgess: 0,
  currentProgress: 0,
  isAnimating: false,
  Init: function Init($scope) {
    var _animation = this;

    if (_animation.enabled && typeof Snap != 'undefined') {
      _animation.svgs = {
        RouteLine: {
          div: Snap("#svg-01"),
          started: false,
          done: false
        }
      };

      Snap.load(config.siteRoot + 'images/nav-journey-path.svg', function (f) {
        var g = f.selectAll('#main-route');
        _animation.svgs.RouteLine.div.append(g);

        _animation.svg_el = {
          MainRoute: _animation.svgs.RouteLine.div.select('#path'),
          Arrow: _animation.svgs.RouteLine.div.select('#arrow'),
          ArrowPath: _animation.svgs.RouteLine.div.select('#arrow-path')
        };

        _animation.svg_attr = {
          main_line_reset: {
            strokeDashoffset: _animation.svg_el.MainRoute.getTotalLength(),
            strokeDasharray: _animation.svg_el.MainRoute.getTotalLength()
          },
          main_line: {
            strokeDashoffset: 0
          }
        };
        _animation.currentProgress = 0;
      });
    } else {

      var png = $('#svg-01').data("png");
      $('#svg-01').after('<img src="' + png + '" class="svg--route-main">');

      // $('#svg-01').after('<object data="'+png+'" type="image/svg+xml" class="svg--route-main"></object>');
    }

    $scope.find('.js-animated-text').removeClass('before-animate');
  },
  Reset: function Reset() {
    var _animation = this;
    var svg_el = _animation.svg_el;
    var svg_attr = _animation.svg_attr;

    svg_el.Arrow.attr({
      opacity: '0'
    });
    _animation.svg_el.MainRoute.animate(svg_attr.main_line_reset, 0);
    _animation.currentProgress = 0;
    _animation.scrolledToProgess = 0;
    _animation.isAnimating = false;
  },
  Start: function Start(value) {
    var _animation = this;
    var value = value;

    var svg_el = _animation.svg_el;
    var svg_attr = _animation.svg_attr;

    var animate_to = function animate_to(value) {
      var ArrowPathLen = svg_el.ArrowPath.getTotalLength();
      var duration = 6000;
      var segment_duration = (value - _animation.currentProgress) * duration;

      console.log('animate_to (value) : ', value, 'current progress : ', _animation.currentProgress);

      var attr = {
        strokeDashoffset: (1 - value) * ArrowPathLen
      };

      // proceed if new value is greater than current progress
      if (!(value < _animation.currentProgress)) {

        _animation.isAnimating = true;
        console.log('animating:', _animation.isAnimating);
        // animate main line
        if (svg_el.MainRoute) {
          svg_el.MainRoute.animate(attr, segment_duration, _animation.AnimationDone);
        }
        svg_el.Arrow.attr({
          opacity: '1'
        });

        // animate arrow along path
        Snap.animate(_animation.currentProgress * ArrowPathLen, value * ArrowPathLen, function (v) {
          var movePoint = svg_el.ArrowPath.getPointAtLength(v);
          svg_el.Arrow.transform('t' + parseInt(movePoint.x - 740) + ',' + parseInt(movePoint.y - 1840) + 'r' + (movePoint.alpha + 90));
        }, segment_duration);

        _animation.currentProgress = value;
      }
    };
    // condition to animate: 1) not currently animating, 2) progress not completed yet
    if (!_animation.isAnimating && _animation.currentProgress != 1 && _animation.enabled == true) {
      animate_to(value);
    }
  },
  CheckProgress: function CheckProgress() {

    if (DBSNAV.Animation.scrolledToProgess > DBSNAV.Animation.currentProgress) {
      DBSNAV.Animation.Start(DBSNAV.Animation.scrolledToProgess);
    } else {
      DBSNAV.Animation.isAnimating = false;
    }
  },
  AnimationDone: function AnimationDone() {

    DBSNAV.Animation.isAnimating = false;
    console.log('animating:', DBSNAV.Animation.isAnimating);

    DBSNAV.Animation.CheckProgress();
  }
};
//# sourceMappingURL=animation.js.map
