import Scroll from '../../scrollTo/dom'
import { ulDomlist } from './addhtml'


let offset = 1000
let ulScroll = new Scroll(ulDomlist, {
    offset,
})

window.ulScroll = ulScroll
window.ran = ran
window.cancel = ulScroll.cancel
window.addLi = (len) => addLi(ulDomlist, len)

function ran(random = parseInt(Math.random() * 50, 10)) {
    let childNodes = ul.childNodes[random]
    let scrollPromise = ulScroll.scrollTo(childNodes)
    scrollPromise.then(e => {
        console.log('next', e)
    }).catch(e => {
        console.log('error=>', error)
    })
}

function addLi(ele, length = 1) {
    for (let i = 0; i < length; i++) {
        let li = document.createElement('li')
        li.style.height = 210
        li.innerHTML = `第 ${51 + i} 条信息`
        ele.appendChild(li)
    }
}
export default ran





