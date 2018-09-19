import * as _ from './utils'
import Scroll from './core';
import { tap, map, switchMap, switchMapTo, takeUntil, filter } from 'rxjs/operators'
import { Subject, of, empty, identity, noop } from 'rxjs'
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

    let subject$ = new Subject()
    let cancel$ = new Subject()
    let getRadio$ = function () {
        return (new Scroll(options)).init()
    }
    let doScroll = (offset, offsetParent) => {
        console.log(offsetParent, "触发")
        return getRadio$().pipe(
            takeUntil(cancel$),
            map(ratio => getPosition(offset, ratio)),
            tap(position => setScroll(offsetParent, position))
        )
    }

    subject$.pipe(
        // tap(({offset}) => console.log(offset,"触发")),
        switchMap((data) => {
            console.log(data.isEmpty, data.offset)
            return data.isEmpty ? empty() : doScroll(data.offset, data.offsetParent)
        })
    ).subscribe({
        // next: console.log
    })

    while (i < maxBubble && (scrollContent = getParentNode(prevScroll))) {
        i++
        prevScroll = scrollContent
        if (scrollContent === window) {
            let offset = getOffset(true, window, moveItem)
            let offsetParent = window
            subject$.next({
                isEmpty: false,
                offset,
                offsetParent
            })
            return
        }
        let { offsetHeight, scrollHeight } = scrollContent
        if (offsetHeight !== scrollHeight && scrollHeight - offsetHeight > 20) {
            let offset = getOffset(false, scrollContent, moveItem)
            let offsetParent = scrollContent
            subject$.next({
                isEmpty: false,
                offset,
                offsetParent
            })
            moveItem = scrollContent
        } else {
            subject$.next({
                isEmpty: true
            })
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
    console.log(offsetParent, { top, left })
    offsetParent.scrollTo
        ? offsetParent.scrollTo({ top, left })
        : setEle()
    return true
    function setEle() {
        offsetParent.scrollTop = top
        offsetParent.scrollLeft = left
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