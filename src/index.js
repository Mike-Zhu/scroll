import "./main.css"
import Scroll, { scrollTo } from '../scrollTo/dom'
import { ul, listArray } from './dirty/addhtml'
import { tap, map, switchMap, switchMapTo, takeUntil, filter, mapTo, take, takeWhile, delayWhen, delay, mergeMap } from 'rxjs/operators'
import { Subject, of, empty, identity, noop, interval, timer, from } from 'rxjs'

// let fromList = list => {
//     console.log('callback =>', list)
//     // from(list).subscribe({
//     //     next: (e) => console.log('secondRx => ', e)
//     // })
// }
// interval().pipe(
//     take(10),
//     map(next => {
//         if (next % 2 === 0) {
//             return [next, 100 + next]
//         } else {
//             return next
//         }
//     }),
//     mergeMap(x => {
//         // console.log('x => ', x)
//         return Array.isArray(x) ? from(x) : of(x)
//     })
// ).subscribe({
//     next: fromList
// })


// let typeList = [
//     '全局', '局部', '局部2', '全局2'
// ]
let typeList = [
    '全局', '局部', '局部2', '全局2'
]

window.$scrollTo = scrollTo
// let ulScroll = new Scroll(ul, {
//     offset: 1000
// })
// window.ulScroll = ulScroll
// window.ran = function (random = parseInt(Math.random() * 50, 10)) {
//     let childNodes = ul.childNodes[random]
//     console.log(random)
//     ulScroll.scrollTo(childNodes)
// }
// setInterval(ran, 3000)
// setTimeout(() => {
//     scrollTo(divList[29])
// }, 1000)


window.ran = function (ranNum, num) {
    ranNum = ranNum || ranNum === 0
        ? ranNum
        : parseInt(Math.random() * listArray.length, 10)

    let list = listArray[ranNum],
        type = typeList[ranNum]

    num = num || num === 0
        ? num
        : parseInt(Math.random() * list.length)

    console.log(`运动到 ${type} 第${num}个`)
    window.ali = scrollTo(list[num])
}


