let root = document.querySelector('#root')

for(let i = 0;i<1000;i++){
    let li =document.createElement('li')
    li.innerHTML = i
    root.appendChild(li)
}