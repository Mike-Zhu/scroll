/**
 * 
 * @param {Number} from 
 * @param {Number} to
 * @param {Number} num
 * return List<number> 
 */
export function getScrollList(from, to, num) {
    let isDec = from < to
    let list = []
    let distance = to - from
    let single = distance / num
    for (let i = 0; i < num; i++) {
        from += single
        list.push(from)
    }
    return list
}