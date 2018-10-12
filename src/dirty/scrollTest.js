import "./main.css"
import Scroll from '../../scrollTo/dom'
import { ul } from './dirty/addhtml'



let ulScroll = new Scroll(ul, {
    offset: 1000
})

window.ulScroll = ulScroll
window.ran = function (random = parseInt(Math.random() * 50, 10)) {
    let childNodes = ul.childNodes[random]
    console.log(random)
    ulScroll.scrollTo(childNodes)
}

setInterval(ran, 3000)






