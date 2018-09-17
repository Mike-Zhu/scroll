import { getParentNode } from './utils'

export function scrollTo(argu) {
    let scrollContent,
        moveItem = argu,
        i = 0
    while (i < 20 && moveItem) {
        i++
        scrollContent = getParentNode(moveItem)
        if (scrollContent === window) {
            window.scrollTo({
                top: moveItem.offsetTop,
                behavior: "smooth"
            })
            return
        } else {
            scrollContent.scrollTop = moveItem.offsetTop - moveItem.offsetHeight
        }
        moveItem = scrollContent
    }
}