import './main.css'

let root = document.querySelector('#root')

for (let i = 0; i < 1000; i++) {
    let li = document.createElement('li')
    li.innerHTML = i
    root.appendChild(li)
}

function scrollTo() {
    let from = root.scrollTop
    let to = parseInt(10000 * Math.random())
}


// setInterval(() => {
    window.requestAnimationFrame(scrollTo);
// }, 800)
