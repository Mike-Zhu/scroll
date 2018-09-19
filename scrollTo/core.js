import { Observable } from 'rxjs'
import { raf, cancelRaf } from './utils'

export default class Scroll {
    constructor(options) {
        this.options = options
        this.rafId = null
        this.startTime = null
        this.loop = null
    }

    init = () => {
        return Observable.create(observer => {
            this.loop = this.createLoop(observer)
            this.rafId = raf(this.loop)
        })
    }

    createLoop = observer => timestamp => {
        let { duration, timingFunction } = this.options
        this.startTime = this.startTime || timestamp - 1
        let timeElapsed = timestamp - this.startTime
        let value = timingFunction(timeElapsed, 0, 1, duration)
        if (timeElapsed > duration) {
            observer.next(1)
            observer.complete(timeElapsed)
        } else {
            observer.next(value)
            raf(this.loop)
        }
    }

    cacel() {
        cancelRaf(this.rafId)
    }
}