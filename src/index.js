import "./main.css"
import { scrollTo } from '../scrollTo/core'

let root = document.querySelector('#root')
let ul = document.querySelector('#ul')

let liList = []
for (let i = 0; i < 1000; i++) {
    let li = document.createElement('li')
    li.innerHTML = i
    ul.appendChild(li)
    liList.push(li)
}

let divList = []
for (let j = 0; j < 30; j++) {
    let ctxDiv = document.createElement('div')
    ctxDiv.setAttribute('class', 'ctxDiv')
    ctxDiv.innerHTML = `这里是第${j}号占位符\n\n\n\n\n`.repeat(50)
    root.appendChild(ctxDiv)
    divList.push(ctxDiv)
}


setInterval(function () {
    let isLiList = Math.random() > 0.5
    let list = isLiList ? liList : divList
    let num = parseInt(Math.random() * list.length)
    console.log(`运动到 ${isLiList ? '局部' : '全局'} 第${num}个`)
    scrollTo(list[num])
}, 3000)

// setTimeout(() => {
//     scrollTo(divList[29])
// }, 1000)