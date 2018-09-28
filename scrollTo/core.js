import { Observable } from 'rxjs'
import { raf, cancelRaf } from './utils'

let rafId = null

export default function getRatio(options) {
    let startTime = null
    let loop = null
    const createLoop = observer => timestamp => {
        let { duration, timingFunction } = options
        startTime = startTime || timestamp - 1
        let timeElapsed = timestamp - startTime
        let value = timingFunction(timeElapsed, 0, 1, duration)
        if (timeElapsed > duration) {
            observer.next(1)
            observer.complete()
        } else {
            observer.next(value)
            raf(loop)
        }
    }

    return Observable.create(observer => {
        loop = createLoop(observer)
        rafId = raf(loop)
    })
}

export function cancel() {
    cancelRaf(rafId)
}
