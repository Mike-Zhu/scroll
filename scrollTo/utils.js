// export const option = {
//     left: Number,
//     top: Number,
//     behavior: String(smooth, instant ,auto )
// }

export function getParentNode(dom) {
    if (dom.nodeName === 'BODY') {
        return window
    }
    return dom.parentNode
}