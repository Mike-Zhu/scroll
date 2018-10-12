

let root = document.querySelector('#root')
export let listArray = Array(10).fill(1).map(res => [])



export let ul = appendUl(root, 'ul')
addLi(ul, listArray[1])

export let ulTwo = appendUl(ul, 'ul2')
addLi(ulTwo, listArray[2])

addDiv(root, listArray[3])

listArray = listArray.filter(res => res.length > 0)



/**
 * @param {HTMLdom} ele
 * @param {Array <empty>} list
 */
function addLi(ele, list, length = 50) {
    for (let i = 0; i < length; i++) {
        let li = document.createElement('li')
        li.style.height = 210
        li.innerHTML = `${i} 这是更内部的东西`
        ele.appendChild(li)
        list.push(li)
    }
}
function addDiv(ele, list, length = 50) {
    for (let j = 0; j < length; j++) {
        let ctxDiv = document.createElement('div')
        ctxDiv.id = 'ctx' + j
        ctxDiv.setAttribute('class', 'ctxDiv')
        ctxDiv.innerHTML = `这里是第${j}号占位符\n\n\n\n\n`.repeat(30)
        ele.appendChild(ctxDiv)
        list.push(ctxDiv)
    }

}


function appendUl(ele, id) {
    let ul = document.createElement('ul')
    ul.setAttribute('id', id)
    ele.appendChild(ul)
    return ul
}