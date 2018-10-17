import Scroll from '../../scrollTo/dom'
import { ul } from './addhtml'


let offset = 1000
let ulScroll = new Scroll(ul, {
    offset,
    duration: 600,
})

window.ulScroll = ulScroll
window.ran = ran
window.cancel = ulScroll.cancel
function ran(random = parseInt(Math.random() * 50, 10)) {
    let childNodes = ul.childNodes[random]
    let promiseObj = ulScroll.scrollTo(childNodes)

    promiseObj.then(e => {
        console.log('next', e)
    }).catch(e => {
        console.log('error=>', error)
    })
    // console.log(`运动到第 ${random} 条`)
}

export default ran





