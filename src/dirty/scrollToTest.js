
import { listArray } from './dirty/addhtml'
import Scroll, { scrollTo } from '../../scrollTo/dom'

let typeList = [
    '全局', '局部', '局部2', '全局2'
]

window.$scrollTo = scrollTo

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