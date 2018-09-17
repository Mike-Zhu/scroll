import { getParentNode, raf, cacelRaf, easeOut } from './utils'

let defaultOption = {
    duration: 800
}

let scrollTid = null
export function scrollTo(argu) {
    let scrollContent,
        prevScroll = argu,
        moveItem = argu,
        i = 0 //防止爆栈
    while (i < 1000 && prevScroll) {
        i++
        scrollContent = getParentNode(prevScroll)
        if (scrollContent === window) {
            scroll({
                moveItem,
                isWindow: true,
                offsetParent: window
            })
            return
        } else {
            let { offsetHeight, scrollHeight } = scrollContent
            if (offsetHeight !== scrollHeight) {
                scroll({
                    moveItem,
                    offsetParent: scrollContent
                })
                moveItem = scrollContent
            }
            prevScroll = scrollContent
        }
    }
}

function scroll(argu, option = {}) {
    const { isWindow, offsetParent, moveItem } = argu
    option = Object.assign({}, option, defaultOption)
    const { duration } = option
    const setScroll = function (top, left) {
        isWindow
            ? window.scrollTo({ top, left })
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

    function loop(timescamp) {
        let {
            fromTop: currentScrollTop,
            fromLeft: currentScrollLeft
        } = getOffset(isWindow, offsetParent, moveItem)
        if (!startTime) startTime = timescamp - 1;
        let timeElapsed = timescamp - startTime;
        let valLeft = easeOut(timeElapsed, fromLeft, distanceLeft, duration)
        let valTop = easeOut(timeElapsed, fromTop, distanceTop, duration)

        prevScrollTop = currentScrollTop
        prevScrollLeft = currentScrollLeft

        setScroll(valTop, valLeft)
        if (timeElapsed < duration) {
            scrollTid = raf(loop)
        } else {
            if (currentScrollTop !== toTop || currentScrollLeft !== toLeft) {
                scroll(argu)
            } else {
                setScroll(toTop, toLeft)
            }
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
        let newScrollTop = moveItem.offsetTop - moveItem.offsetHeight,
            oldScrollTop = offsetParent.scrollTop,
            newScrollLeft = moveItem.offsetLeft - moveItem.offsetWidth,
            oldScrollLeft = offsetParent.scrollLeft
        return {
            fromLeft: oldScrollLeft,
            toLeft: newScrollLeft,
            fromTop: oldScrollTop,
            toTop: newScrollTop
        }
    }
}