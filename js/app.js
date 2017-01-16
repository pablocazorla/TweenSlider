// APP


TweenSlider({
  target: '#str-horizontal',
  //pagination: '.pagination',
  //arrowPrev: '.arrow arrow-prev',
  //arrowNext: '.arrow arrow-next',
  frame_SETUP: function(index, frame) {
    var $frame = $(frame),
      textBox = $frame.find('.text-box')[0],
      textBoxRed = $frame.find('.text-box-red')[0];
    TweenMax.set(textBoxRed, {
      opacity: 0,
      y: '100px'
    });
    TweenMax.set(textBox, {
      opacity: 0,
      x: '-100px'
    });
  },
  frame_IN: function(index, frame) {

    var $frame = $(frame),
      textBox = $frame.find('.text-box')[0],
      textBoxRed = $frame.find('.text-box-red')[0],
      tl = new TimelineMax();

    tl
      .to(frame, 1, {
        opacity: 1,
        'z-index': 15
      })
      .to(textBoxRed, .6, {
        opacity: 1,
        y: '0px',
        ease: Power2.easeOut
      }, '-=0.6')
      .to(textBox, .4, {
        opacity: 1,
        x: '0px',
        ease: Power2.easeOut
      }, '-=0.4');

    return tl;
  },
  frame_OUT: function(index, frame) {
    var $frame = $(frame),
      textBox = $frame.find('.text-box')[0],
      textBoxRed = $frame.find('.text-box-red')[0],
      tl = new TimelineMax();

    tl
      .to(textBox, .4, {
        opacity: 0,
        x: '100px',
      }, {
        opacity: 0,
        x: '100px',
        ease: Power2.easeIn
      })
      .to(textBoxRed, .6, {
        opacity: 0,
        y: '-100px',
        ease: Power2.easeIn
      }, '-=0.4')
      .to(frame, 0.6, {
        opacity: 0,
        'z-index': 14
      }, '-=0.6')
      .to(frame, 1, {
        opacity: 0,
        'z-index': 14
      });

    return tl;
  }
});
