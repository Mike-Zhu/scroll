import * as _ from './utils'
import Scroll from './core';
import { tap, map, switchMap, switchMapTo, takeUntil, filter, mapTo, take, takeWhile, delayWhen, delay } from 'rxjs/operators'
import { Subject, of, empty, identity, noop, interval, timer } from 'rxjs'
const { getParentNode, raf, cancelRaf, cacelRaf, easeOut } = _
let defaultOption = {
    duration: 800,
    timingFunction: 'easeOut',
    maxBubble: 5
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
        maxBubble = options.maxBubble

    let cancel$ = new Subject()
    let doScroll = ({ offset, offsetParent, isEmpty }) => {
        if(isEmpty) return true
        let radio$ = (new Scroll(options)).init()
        let subscribition = {
            next: position => setScroll(offsetParent, position),
            // complete: () => console.log('单次结束后的回调'),
        }
        return radio$.pipe(
            takeUntil(cancel$),
            map(ratio => getPosition(offset, ratio)),
        ).subscribe(subscribition)
    }

    interval().pipe(
        take(maxBubble),
        takeWhile(isValidHTML),
        map(getData),
        tap(doScroll)
    ).subscribe({
        complete: v => console.log('结束后的回调')
    })

    return {
        cancel: function () {
            cancel$.next(1)
        },
        redirect: function (newElem) {
            cancel$.next(1)
            scrollTo(newElem, options)
        }
    }
    function isValidHTML() {
        return prevScroll = scrollContent = getParentNode(prevScroll)
    }
    function getData() {
        if (scrollContent === window) {
            let offset = getOffset(true, window, moveItem)
            let offsetParent = window
            return {
                isEmpty: false,
                offset,
                offsetParent
            }
        }
        let { offsetHeight, scrollHeight } = scrollContent
        if (offsetHeight !== scrollHeight && scrollHeight - offsetHeight > 20) {
            let offset = getOffset(false, scrollContent, moveItem)
            moveItem = scrollContent
            return {
                isEmpty: false,
                offset,
                offsetParent: scrollContent
            }
        } else {
            return {
                isEmpty: true
            }
        }
    }
}
function getPosition(offset, ratio) {
    let distanceLeft = offset.toLeft - offset.fromLeft
    let distanceTop = offset.toTop - offset.fromTop
    return {
        left: distanceLeft * ratio + offset.fromLeft,
        top: distanceTop * ratio + offset.fromTop
    }
}

function setScroll(offsetParent, { top, left }) {
    raf(function () {
        offsetParent.scrollTo
            ? offsetParent.scrollTo({ top, left })
            : setEle()
        return true
        function setEle() {
            offsetParent.scrollTop = top
            offsetParent.scrollLeft = left
        }
    })
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