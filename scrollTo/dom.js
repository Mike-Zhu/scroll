import * as _ from './utils'
import Scroll from './core';
import { tap, map, switchMap, switchMapTo, takeUntil, filter } from 'rxjs/operators'
import { Subject, of } from 'rxjs'
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
    let subjectContinue$ = new Subject()
    let cancel$ = new Subject()
    let getRadio$ = function () {
        return (new Scroll(options)).init()
    }
    const getPosition = ratio => {
        return {
            left: distanceLeft * ratio + offset.fromLeft,
            top: distanceTop * ratio + offset.fromTop
        }
    }

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
        switchMapTo(getRadio$()),
        filter(v => v !== 'empty'),
        takeUntil(cancel$),
        map(getPosition),
        tap(setScroll)
    ).subscribe({
        // next:v => console.log(v),
        complete: v => console.log('completd=>', v),
        error: v => console.log(v)
    })

    subjectContinue$.subscribe({
        next: v => v < 100 && setOneScroll()
    })

    setOneScroll()
    function setOneScroll() {
        i++
        if (i < maxBubble && prevScroll) {
            scrollContent = getParentNode(prevScroll)
            prevScroll = scrollContent
            if (scrollContent === window) {
                offset = getOffset(true, window, moveItem)
                distanceLeft = offset.toLeft - offset.fromLeft
                distanceTop = offset.toTop - offset.fromTop
                offsetParent = window
                console.log('window导致的滚动')
                subject$.next(true)
                return
            }

            let { offsetHeight, scrollHeight } = scrollContent
            if (offsetHeight !== scrollHeight && scrollHeight - offsetHeight > 20) {
                offset = getOffset(false, scrollContent, moveItem)
                distanceLeft = offset.toLeft - offset.fromLeft
                distanceTop = offset.toTop - offset.fromTop
                offsetParent = scrollContent
                console.log('局部导致的滚动')
                subject$.next(true)
            } else {
                subjectContinue$.next(i)
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