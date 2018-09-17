import "./main.css"
import {scrollTo} from '../scrollTo/core'

let root = document.querySelector('#root')
let ul = document.querySelector('#ul')

let liList = []
for (let i = 0; i < 1000; i++) {
    let li = document.createElement('li')
    li.innerHTML = i
    ul.appendChild(li)
    liList.push(li)
}

for(let j = 0 ; j < 20 ; j++){
    let ctxDiv = document.createElement('div')
    ctxDiv.setAttribute('class','ctxDiv')
    ctxDiv.innerHTML = `这里是第${j}号占位符\n\n\n\n\n`.repeat(50)
    root.appendChild(ctxDiv)
}


console.log({node :liList[500]})
setTimeout(() => {
    scrollTo(liList[500])
},3000)