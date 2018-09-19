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
        return getRadio$().pipe(
            takeUntil(cancel$),
            map(ratio => getPosition(offset, ratio)),
            tap(position => setScroll(offsetParent, position)),
            tap({
                complete: () => {
                    console.log('doscroll')
                    startScroll()
                }
            })
        )
    }
    let returnEmpty = () => {
        return empty().pipe(
            tap({
                complete: () => {
                    console.log('empty')
                    startScroll()
                }
            })
        )
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
        offsetParent.scrollTo
            ? offsetParent.scrollTo({ top, left })
            : setEle()
        return true
        function setEle() {
            offsetParent.scrollTop = top
            offsetParent.scrollLeft = left
        }
    }

    subject$.pipe(
        switchMap(({
            offset,
            isEmpty,
            offsetParent
        }) => {
            return isEmpty ? returnEmpty() : doScroll(offset, offsetParent)
        })
    ).subscribe({
        // next: console.log
    })

    startScroll()
    function startScroll() {
        console.log('startScroll  ' + i)
        i++
        if (i < maxBubble && (scrollContent = getParentNode(prevScroll))) {
            prevScroll = scrollContent
            if (scrollContent === window) {
                let offset = getOffset(true, window, moveItem)
                console.log(offset)
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
                console.log(offset)
                let offsetParent = scrollContent
                subject$.next({
                    isEmpty: false,
                    offset,
                    offsetParent
                })
            } else {
                subject$.next({
                    isEmpty: true
                })
            }
        }
    }
}

function getOffset(isWindow, offsetParent, moveItem) {
    console.log(isWindow, offsetParent, moveItem)
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