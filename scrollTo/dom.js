import * as _ from './utils'
import { create } from 'domain';
import Scroll from './core';
import { resolve } from 'dns';

const { getParentNode, raf, cancelRaf, cacelRaf, easeOut } = _
let defaultOption = {
    duration: 600,
    timingFunction: 'easeOut'
}

let scrollTid = null
// document.addEventListener('scroll', cancel)
// function cancel() {
//     cancelRaf(scrollTid);
// }

export function cancelScrollTo() {
    cancelRaf(scrollTid)
}

export function backToScroll(){

}

export function createScroller(elem, options) {
    Scrol.create({
        next: value => {

        },
        finish: value => {
            resolve()
        },
        cacel: () => {

        }
    })
    
}

export default function scroll(elem, options) {
    return createScroll({
        scroller: createScroller(),
        ...options,
    })
}

export function scrollTo(argu, option) {
    cancelRaf(scrollTid)
    let scrollContent,
        prevScroll = argu,
        moveItem = argu,
        i = 0 //防止爆栈
    option = Object.assign({}, option, defaultOption)

    while (i < 1000 && prevScroll) {
        i++
        scrollContent = getParentNode(prevScroll)
        if (scrollContent === window) {
            scroll({
                moveItem,
                isWindow: true,
                offsetParent: window
            }, option)
            return
        } else {
            let { offsetHeight, scrollHeight } = scrollContent
            if (offsetHeight !== scrollHeight && scrollHeight - offsetHeight > 20) {
                scroll({
                    moveItem,
                    offsetParent: scrollContent
                }, option)
                moveItem = scrollContent
            }
            prevScroll = scrollContent
        }
    }
}

function scroll(argu, option) {
    const { isWindow, offsetParent, moveItem } = argu
    const { duration, timingFunction, callback } = option
    const setScroll = function (top, left) {
        offsetParent.scrollTo
            ? offsetParent.scrollTo({ top, left })
            : setEle()
        function setEle() {
            offsetParent.scrollTop = top
            offsetParent.scrollLeft = left
        }
    }
    let startTime = null
    let { fromLeft, toLeft, fromTop, toTop } = getOffset(isWindow, offsetParent, moveItem)
    let distanceLeft = toLeft - fromLeft,
        distanceTop = toTop - fromTop,
        prevScrollTop = null,
        prevScrollLeft = null

    let timeFunc = _[timingFunction] || easeOut
    function loop(timescamp) {
        let {
            fromTop: currentScrollTop,
            fromLeft: currentScrollLeft
        } = getOffset(isWindow, offsetParent, moveItem)

        startTime = startTime || timescamp - 1
        let timeElapsed = timescamp - startTime;

        let valLeft = timeFunc(timeElapsed, fromLeft, distanceLeft, duration)
        let valTop = timeFunc(timeElapsed, fromTop, distanceTop, duration)

        prevScrollTop = currentScrollTop
        prevScrollLeft = currentScrollLeft

        setScroll(valTop, valLeft)
        if (timeElapsed < duration) {
            scrollTid = raf(loop)
        } else {
            let { toLeft, toTop } = getOffset(isWindow, offsetParent, moveItem)
            setScroll(toTop, toLeft)
            callback && callback()
        }
    }
    scrollTid = raf(loop)
}

function getOffset(isWindow, offsetParent, moveItem) {
    if (isWindow) {
        let newScrollTop = moveItem.offsetTop,
            oldScrollTop = offsetParent.scrollY,
            newScrollLeft = moveItem.offsetLeft,
            oldScrollLeft = offsetParent.scrollX
        return {
            fromLeft: oldScrollLeft,
            toLeft: newScrollLeft,
            fromTop: oldScrollTop,
            toTop: newScrollTop
        }
    } else {
        let offsetTop = moveItem.offsetTop,
            offsetLeft = moveItem.offsetLeft
        if (moveItem.offsetParent === offsetParent.offsetParent) {
            offsetTop = offsetTop - offsetParent.offsetTop + moveItem.offsetHeight
            offsetLeft = offsetLeft - offsetParent.offsetLeft + moveItem.offsetWidth
        }
        let newScrollTop = offsetTop - moveItem.offsetHeight,
            oldScrollTop = offsetParent.scrollTop,
            newScrollLeft = offsetLeft - moveItem.offsetWidth,
            oldScrollLeft = offsetParent.scrollLeft
        return {
            fromLeft: oldScrollLeft,
            toLeft: newScrollLeft,
            fromTop: oldScrollTop,
            toTop: newScrollTop
        }
    }
}