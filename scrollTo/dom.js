import * as _ from './utils'
import Scroll from './core';
import { tap, map } from 'rxjs/operators'

const { getParentNode, raf, cancelRaf, cacelRaf, easeOut } = _
let defaultOption = {
    duration: 600,
    timingFunction: 'easeOut'
}

export default function scrollTo(elem, options) {
    options = Object.assign({}, defaultOption, options)
    options = {
        ...options,
        timingFunction: getTiminFunction(options)
    }
    let scrollContent,
        prevScroll = elem,
        moveItem = elem,
        i = 0, //防止爆栈
        maxBubble = options.max || 1000
    while (i < maxBubble && prevScroll) {
        i++
        scrollContent = getParentNode(prevScroll)
        if (scrollContent === window) {
            scroll({
                moveItem,
                isWindow: true,
                offsetParent: window
            }, options)
            return
        } else {
            let { offsetHeight, scrollHeight } = scrollContent
            if (offsetHeight !== scrollHeight && scrollHeight - offsetHeight > 20) {
                scroll({
                    moveItem,
                    offsetParent: scrollContent
                }, options)
                moveItem = scrollContent
            }
            prevScroll = scrollContent
        }
    }
}

function scroll({ moveItem, isWindow, offsetParent }, options) {
    const { duration, timingFunction, callback } = options
    const setScroll = function ({top, left}) {
        offsetParent.scrollTo
            ? offsetParent.scrollTo({ top, left })
            : setEle()
        function setEle() {
            offsetParent.scrollTop = top
            offsetParent.scrollLeft = left
        }
    }
    const getPosition = ratio => ({
        left: distanceLeft * ratio + fromLeft,
        top: distanceTop * ratio + fromTop
    })
    let { fromLeft, toLeft, fromTop, toTop } = getOffset(isWindow, offsetParent, moveItem)
    let distanceLeft = toLeft - fromLeft,
        distanceTop = toTop - fromTop,
        prevScrollTop = null,
        prevScrollLeft = null
    let ratio$ = (new Scroll(options)).init()
    ratio$.pipe(
        map(getPosition),
        tap(setScroll)
    ).subscribe(() => ({}))
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

function getTiminFunction(options) {
    let { timingFunction } = options
    if (_.isFunction(timingFunction)) {
        return timingFunction
    }
    if (_.isString(timingFunction)) {
        return _[timingFunction] || easeOut
    }
    return easeOut
}