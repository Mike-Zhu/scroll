import "./main.css"
import Scroll, { scrollTo } from '../scrollTo/dom'
import {ul} from './dirty/addhtml'

let typeList = [
    '全局', '局部', '局部2', '全局2'
]


window.$scrollTo = scrollTo

let ulScroll = new Scroll(ul, {
    offset: 100
})
window.ulScroll = ulScroll
window.ran = function () {
    let random = parseInt(Math.random() * 50, 10)
    let childNodes = ul.childNodes[random]
    console.log(random)
    ulScroll.scrollTo(childNodes)
}
// setInterval(ran, 3000)
// setTimeout(() => {
//     scrollTo(divList[29])
// }, 1000)


// window.ran = function (ranNum, num) {
//     ranNum = ranNum || ranNum === 0
//         ? ranNum
//         : parseInt(Math.random() * listArray.length, 10)

//     let list = listArray[ranNum],
//         type = typeList[ranNum]

//     num = num || num === 0
//         ? num
//         : parseInt(Math.random() * list.length)

//     console.log(`运动到 ${type} 第${num}个`)
//     window.ali = scrollTo(list[num])
// }


