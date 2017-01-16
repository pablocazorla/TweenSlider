// TweenSlider
(function($, win) {
  "use strict";

  var tweenslider = function(options) {
    return this.init(options);
  };

  tweenslider.prototype = {
    init: function(options) {
      this.config = $.extend({

        // Target selection
        target: '',

        // Frame class to select inside
        frames: '.frame',

        // Initial frame
        initial: 0,

        // Timeline Functions for frames
        frame_SETUP: function() {},
        frame_IN: null,
        frame_OUT: null,

        enableArrows: true,
        enablePagination: true,

        // UI: Arrows
        arrowPrev: '<div class="arrow-tweenslider arrow-tweenslider-prev">&lt;</div>',
        arrowNext: '<div class="arrow-tweenslider arrow-tweenslider-next">&gt;</div>',

        // UI: Pagination bullets
        pagination: '<div class="pagination-tweenslider"></div>',
        paginationElement: '<span></span>',
        paginationElementActiveClass: 'active',
        paginationNumbers: false,

        // Enabled touch
        touch: true

      }, options);

      // jQuery selections
      this.$target = $(this.config.target);
      this.$frames = this.$target.find(this.config.frames);

      // Variables     
      this.current = -1;
      this.nextFrame = 0;
      this.moving = false;
      this.length = this.$frames.length;

      // Set animations 
      var self = this;
      this.frame = [];
      this.$frames.each(function(index) {
        self.config.frame_SETUP(index, this);
        var o = {
          _IN: self.config.frame_IN(index, this).pause().eventCallback('onComplete', function() {
            self.current = self.nextFrame;
            self.moving = false;
          }),
          _OUT: self.config.frame_OUT(index, this).pause()
        }
        self.frame.push(o);
      });

      // UI
      // arrows
      if (this.config.enableArrows) {
        $(this.config.arrowPrev).appendTo(this.$target).click(function() {
          self.prev();
        });
        $(this.config.arrowNext).appendTo(this.$target).click(function() {
          self.next();
        });
      }
      // pagination
      if (this.config.enablePagination) {
        this.$pags = $('');
        var $pagination = $(this.config.pagination).appendTo(this.$target),
          addBullet = function(i) {
            var $p = $(self.config.paginationElement).appendTo($pagination).click(function() {
              self.goto(i);
            });
            self.$pags = self.$pags.add($p);
          };

        for (var i = 0; i < this.length; i++) {
          addBullet(i);
        }
      }





      if (this.config.touch && typeof Hammer !== 'undefined') {
        this.setTouchEvents(this);
      }


      return this.next();
    },
    prev: function() {
      this.goto(this.current - 1);
      return this;
    },
    next: function() {
      this.goto(this.current + 1);
      return this;
    },
    goto: function(num) {
      if (!this.moving && num !== this.current) {
        this.moving = true;
        this.nextFrame = (num < 0) ? this.length - 1 : ((num >= this.length) ? 0 : num);
        console.log(this.nextFrame);
        if (this.current >= 0) {
          this.frame[this.current]._OUT.restart();
        }
        this.frame[this.nextFrame]._IN.restart();
        if (this.config.enablePagination) {
          this.$pags.removeClass(this.config.paginationElementActiveClass).eq(this.nextFrame).addClass(this.config.paginationElementActiveClass);
        }
      }
      return this;
    },
    setTouchEvents: function(self) {

      var touchHandler = new Hammer(self.$target[0]),
        startedPan = false,
        dx = 0;
      self.$target.on('mousedown', function() {
        return false;
      });

      touchHandler.on("panstart", function(ev) {
        if(!self.moving && Math.abs(ev.deltaX) < 20){
          startedPan = true;
        }
      });
      touchHandler.on("panend", function(ev) {
        if (!self.moving && Math.abs(ev.deltaX) > 20 && startedPan) {
          var dir = Math.abs(ev.deltaX) / ev.deltaX;

          if (dir > 0) {
            self.prev();
          } else {
            self.next();
          }
          startedPan = false;
          dx = 0;
        }
      });

      return this;
    }
  };

  win.TweenSlider = function(options) {
    return new tweenslider(options);
  };
})(jQuery, window);
