import * as _ from './utils'
import Scroll from './core';
import { tap, map, switchMap, switchMapTo, takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
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
    let offset = {},
        distanceLeft = 0,
        distanceTop = 0,
        offsetParent = {}

    let subject$ = new Subject()
    let cancel$ = new Subject()
    let radio$ = (new Scroll(options)).init()

    const getPosition = ratio => ({
        left: distanceLeft * ratio + offset.fromLeft,
        top: distanceTop * ratio + offset.fromTop
    })

    const setScroll = function ({ top, left }) {
        offsetParent.scrollTo
            ? offsetParent.scrollTo({ top, left })
            : setEle()
        function setEle() {
            offsetParent.scrollTop = top
            offsetParent.scrollLeft = left
        }
    }

    subject$.pipe(
        switchMapTo(radio$),
        takeUntil(cancel$),
        map(getPosition),
    ).subscribe({
        next: v => setScroll(v) || console.log(v) 
    })

    while (i < maxBubble && prevScroll) {
        i++
        scrollContent = getParentNode(prevScroll)
        if (scrollContent === window) {
            offset = getOffset(true, window, moveItem)
            distanceLeft = offset.toLeft - offset.fromLeft
            distanceTop = offset.toTop - offset.fromTop
            offsetParent = window
            subject$.next(1)
            return
        } else {
            let { offsetHeight, scrollHeight } = scrollContent
            if (offsetHeight !== scrollHeight && scrollHeight - offsetHeight > 20) {
                offset = getOffset(false, scrollContent, moveItem)
                distanceLeft = offset.toLeft - offset.fromLeft
                distanceTop = offset.toTop - offset.fromTop
                prevScroll = offsetParent = scrollContent
                subject$.next(1)
            }
        }
    }

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