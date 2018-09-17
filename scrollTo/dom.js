import { getParentNode, raf, cacelRaf } from './utils'
export function scrollTo(argu) {
    raf(sport)
    function sport() {
        let scrollContent,
            prevScroll = argu,
            moveItem = argu,
            i = 0 //防止爆栈
        while (i < 1000 && prevScroll) {
            i++
            scrollContent = getParentNode(prevScroll)
            if (scrollContent === window) {
                window.scrollTo({
                    top: moveItem.offsetTop - moveItem.offsetHeight,
                    left: moveItem.offsetLeft,
                })
                return
            } else {
                let { offsetHeight, scrollHeight } = scrollContent
                if (offsetHeight !== scrollHeight) {
                    // console.log(scrollContent)
                    scrollContent.scrollTop = moveItem.offsetTop - moveItem.offsetHeight
                    scrollContent.scrollLeft = moveItem.offsetLeft - moveItem.offsetWidth
                    moveItem = scrollContent
                }
                prevScroll = scrollContent
            }
        }
    }
}