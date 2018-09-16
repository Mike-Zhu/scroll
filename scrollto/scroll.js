/**
 * easeOutQuart Easing Function
 * @param  {number} t - current time
 * @param  {number} b - start value
 * @param  {number} c - change in value
 * @param  {number} d - duration
 * @return {number} - calculated value
 */
function easeOutQuart(t, b, c, d) {
    t /= d;
    t--;
    return -c * (t * t * t * t - 1) + b;
  }
  
  /**
   * Defaults
   * @type {object}
   */
  const scrollDefaults = {
    tolerance: 0,
    duration: 800,
    getScrollTop: () => window.scrollY,
    setScrollTop: y => window.scrollTo(0, y),
    getTargetScrollTop: () => 0
  };
  
  let scrollTid;
  export default function scrollTo(options) {
    cancelRaf(scrollTid);
    options = {
      ...scrollDefaults,
      ...options
    };
  
    let from = options.getScrollTop();
    let to = options.getTargetScrollTop();
    let distance = to - from;
    let startTime = null;
    let previousScrollTop;
    distance -= options.tolerance;
  
    // rAF loop
    let loop = currentTime => {
      let currentScrollTop = options.getScrollTop();
  
      // To starts time from 1, we subtracted 1 from current time
      // If time starts from 1 The first loop will not do anything,
      // because easing value will be zero
      if (!startTime) startTime = currentTime - 1;
  
      let timeElapsed = currentTime - startTime;
      let val = easeOutQuart(timeElapsed, from, distance, options.duration);
  
      previousScrollTop = currentScrollTop;
      options.setScrollTop(val);
  
      if (timeElapsed < options.duration) {
        scrollTid = raf(loop);
      } else {
        let targetScrollTop = options.getTargetScrollTop();
        if (targetScrollTop !== to) {
          scrollTo(options);
        } else {
          options.setScrollTop(distance + from);
          options.callback && options.callback();
        }
      }
    };
  
    scrollTid = raf(loop);
  }
  
  function raf(f) {
    if (window.requestAnimationFrame) {
      return window.requestAnimationFrame(f);
    }
    return requestAnimationFrame(f);
  }
  
  function cancelRaf(tid) {
    if (window.cancelAnimationFrame) {
      window.cancelAnimationFrame(tid);
    } else {
      clearTimeout(tid);
    }
  }
  
  var lastTime = 0;
  function requestAnimationFrame(callback) {
    var now = Date.now();
    var nextTime = Math.max(lastTime + 16, now);
    return setTimeout(function() {
      callback((lastTime = nextTime));
    }, nextTime - now);
  }
  
  export const scrollToElem = (scroller, elem, options) => {
    let getScrollTop = () => {
      return scroller.scrollTop;
    };
    let setScrollTop = value => {
      scroller.scrollTop = value;
    };
    let getTargetScrollTop = () => elem.offsetTop;
    scrollTo({
      ...options,
      getTargetScrollTop,
      getScrollTop,
      setScrollTop
    });
  };
  
  export const scrollToBottom = (scroller, options) => {
    let getScrollTop = () => {
      return scroller.scrollTop;
    };
    let setScrollTop = value => {
      scroller.scrollTop = value;
    };
    let getTargetScrollTop = () => {
      return scroller.scrollHeight - scroller.clientHeight;
    };
    scrollTo({
      ...options,
      getTargetScrollTop,
      getScrollTop,
      setScrollTop
    });
  };
  
  export const scrollToTop = (scroller, options) => {
    let getScrollTop = () => {
      return scroller.scrollTop;
    };
    let setScrollTop = value => {
      scroller.scrollTop = value;
    };
    let getTargetScrollTop = () => 0;
    scrollTo({
      ...options,
      getTargetScrollTop,
      getScrollTop,
      setScrollTop
    });
  };
  