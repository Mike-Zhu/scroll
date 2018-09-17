// export const option = {
//     left: Number,
//     top: Number,
//     behavior: String(smooth, instant ,auto )
// }

export function getParentNode(dom) {
    if (dom.nodeName === 'BODY') {
        return window
    }
    return dom.parentNode
}

var lastTime = 0;

export function raf(f) {
    if (window.requestAnimationFrame) {
        return window.requestAnimationFrame(f);
    }
    return requestAnimationFrame(f);
}

export function cancelRaf(tid) {
    if (window.cancelAnimationFrame) {
        window.cancelAnimationFrame(tid);
    } else {
        clearTimeout(tid);
    }
}

function requestAnimationFrame(callback) {
    var now = Date.now();
    var nextTime = Math.max(lastTime + 16, now);
    return setTimeout(function () {
        callback((lastTime = nextTime));
    }, nextTime - now);
}
