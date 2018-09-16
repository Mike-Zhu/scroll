import { getScrollList } from './utils'

export function scroll(from, to, num = 10) {
    let list = getScrollList(from, to, num)
    tap()
}

/**
 * @param {Number} time
 * @param {Number} num
 * @param {Function} func
 * @param {List <Number>} list
 */
function tap(time, num, func, list) {
    if (i >= list.length) return
    setTimeout(() => {
        func(list)
        i++
        scroll()
    }, time / num)

}