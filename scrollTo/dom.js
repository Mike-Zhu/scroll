import * as _ from './utils'
import getRatio from './core';
import { tap, map, switchMap, switchMapTo, takeUntil, filter, mapTo, take, takeWhile, delayWhen, delay } from 'rxjs/operators'
import { Subject, of, empty, identity, noop, interval, timer } from 'rxjs'

const { getParentNode, raf, cancelRaf, easeOut } = _
let defaultOption = {
    duration: 800,
    timingFunction: 'easeOut',
    maxBubble: 5,
    axis: "xy",
    interrupt: false,
    margin: false,
    offset: 0,
    callback: _.noop
}

function getOptions(options) {
    var assignOptions = Object.assign({}, defaultOption, options)
    return {
        ...assignOptions,
        timingFunction: getTiminFunction(assignOptions),
        callback: _.isFunction(options.callback) ? options.callback : _.noop
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
}

export default class Scroll {
    constructor(elem, options) {
        this.elem = elem
        this.options = getOptions(options)
        this.callback = this.options.callback
        this.cancel$ = new Subject()
        this.setInitScroll(this.options, this.elem)
    }
    setInitScroll(options, elem) {
        let { offset: originOffset = 0 } = options
        let offset = this.getOffsetByTarget(originOffset)
        if (elem.scrollTop < offset.top || elem.scrollLeft < offset.left) {
            this.scrollTo(originOffset)
        }
    }
    scrollToTop() {
        let scrollTop = this.elem.scrollTop
        this.scrollTo(0 - scrollTop)
    }

    scrollToBottom() {
        let number = this.elem.scrollHeight
        let scrollTop = this.elem.scrollTop
        this.scrollTo(number - scrollTop)
    }

    getOffsetByNumber(number) {
        let { axis } = this.options
        switch (axis) {
            case 'x':
                return {
                    left: number,
                    top: 0
                }
            case 'y':
                return {
                    left: 0,
                    top: number
                }
            default:
                return {
                    left: number,
                    top: number
                }
        }
    }

    setScroll = ({ distance, originPostion }) => {
        let { elem, options: { offset } } = this
        offset = _.isObject(offset)
            ? offset
            : this.getOffsetByNumber(offset)
        let top = originPostion.top + distance.top
        let left = originPostion.left + distance.left
        //offset 定义留空
        top = top > offset.top ? top : offset.top
        left = left > offset.left ? left : offset.left
        elem.scrollTo = function scrollTo() {
            this.scrollTop = top
            this.scrollLeft = left
        }
        elem.scrollTo({ top, left })
    }

    getOffsetByTarget(target) {
        let offset = {
            left: 0,
            top: 0
        }
        if (_.isString(target)) {
            let number = Number(target) || 0
            offset = this.getOffsetByNumber(number)
        } else if (_.isNumber(target)) {
            offset = this.getOffsetByNumber(target)
        } else if (_.isHTMLElement(target)) {
            if (target.parentNode !== this.elem) {
                throw new Error(`${this.elem} is not ${target} 's offsetParent`)
            }
            let origin = getOffset(this.elem, target)
            offset = {
                left: origin.left,
                top: origin.top
            }
        } else if (target && (target.left || target.top)) {
            offset = {
                ...offset,
                ...target
            }
        } else {
            throw new Error(`${target} is not valid type target!`)
            return null
        }
        return offset
    }
    /**
     * 
     * @param {Number || String || HTMLElement} target 
     */
    scrollTo(target) {
        let { options, cancel$ } = this
        let offset = this.getOffsetByTarget(target)

        if (!offset) {
            return
        }

        let getDistance = ratio => ({
            left: offset.left * ratio,
            top: offset.top * ratio
        })

        let originPostion = {
            left: this.elem.scrollLeft,
            top: this.elem.scrollTop,
        }

        return new Promise((resolve, reject) => {
            getRatio(options).pipe(
                takeUntil(cancel$),
                map(getDistance),
                map(distance => ({ distance, originPostion }))
            ).subscribe({
                next: this.setScroll,
                complete: () => {
                    // this.callback()
                    resolve(null)
                },
                error: () => {
                    console.log('pre error')
                    reject()
                }
            })
        })

    }

    cancel() {
        this.cancel$.next()
    }
}



export function scrollTo(elem, options) {
    options = getOptions(options)
    let scrollContent,
        prevScroll = elem,
        moveItem = elem,
        maxBubble = options.maxBubble

    let cancel$ = new Subject()
    let doScroll = ({ offset, offsetParent, isEmpty }) => {
        if (isEmpty) return true
        let radio$ = getRatio(options)
        let subscribition = {
            next: position => setScroll(offsetParent, position),
            // complete: () => console.log('单次结束后的回调'),
        }
        return radio$.pipe(
            takeUntil(cancel$),
            map(ratio => getPositionByRatio(offset, ratio)),
        ).subscribe(subscribition)
    }

    //这里有机会用mergeMap
    //两个影响因素，1 并行流，2，副作用需要借助块内变量
    interval().pipe(
        take(maxBubble),
        takeWhile(isValidHTML),
        takeUntil(cancel$),
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
            let offset = getOffset(window, moveItem)
            let offsetParent = window
            return {
                isEmpty: false,
                offset,
                offsetParent
            }
        }
        let { offsetHeight, scrollHeight } = scrollContent
        if (offsetHeight !== scrollHeight && scrollHeight - offsetHeight > 20) {
            let offset = getOffset(scrollContent, moveItem)
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

export function setDefaultOption(options) {
    defaultOption = getOptions(options)
}

function getPositionByRatio(offset, ratio) {
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

function getOffset(offsetParent, moveItem) {
    let isWindow = offsetParent === window
    let newScrollTop,
        oldScrollTop,
        newScrollLeft,
        oldScrollLeft
    if (isWindow) {
        newScrollTop = moveItem.offsetTop
        oldScrollTop = offsetParent.scrollY
        newScrollLeft = moveItem.offsetLeft
        oldScrollLeft = offsetParent.scrollX
    } else {
        let offsetTop = moveItem.offsetTop,
            offsetLeft = moveItem.offsetLeft
        if (moveItem.offsetParent === offsetParent.offsetParent) {
            offsetTop = offsetTop - offsetParent.offsetTop + moveItem.offsetHeight
            offsetLeft = offsetLeft - offsetParent.offsetLeft + moveItem.offsetWidth
        }
        newScrollTop = offsetTop - moveItem.offsetHeight
        oldScrollTop = offsetParent.scrollTop
        newScrollLeft = offsetLeft - moveItem.offsetWidth
        oldScrollLeft = offsetParent.scrollLeft
    }
    return {
        fromLeft: oldScrollLeft,
        toLeft: newScrollLeft,
        fromTop: oldScrollTop,
        toTop: newScrollTop,
        left: newScrollLeft - oldScrollLeft,
        top: newScrollTop - oldScrollTop
    }
}

