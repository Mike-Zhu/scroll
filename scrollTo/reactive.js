import { resolve } from "dns";
import { Subject } from "rx";

const interval = period => sink => {
    let value = 0
    let tid = setInterval(() => sink.next(value++), period)
    return () => {
        clearInterval(tid)
        sink.complete()
    }
}

const map = iteratee => source => sink => source({
    ...sink,
    next: value => sink.next(iteratee(value))
})

const filter = predicate => source => sink => source({
    ...sink,
    next: value => predicate(value) && sink.next(value)
})

const take = max => source => sink => {
    console.log({ max, source, sink })
    let count = 0
    let unlinsten = source({
        ...sink,
        next: value => {
            count += 1
            if (count > max) return unlinsten()
            sink.next(value)
        }
    })
    return unlinsten
}

const pipe = (...args) => args.reduce((result, f) => f(result))
const foreach = (next, complete) => source => source({ next, complete })
const log = { next: value => console.log(value), complete() { console.log('complete') } }

pipe(
    interval(100),
    filter(n => n % 2),
    map(n => n + '-'),
    take(10),
    foreach(value => console.log(value), () => console.log('complete'))
)

function scrollTo(scroller, options) {
    let currentY = scroller.getX()
    let targetX = scroller.getTargetX()
    let disantceX = targetX - currentX
    let handleValue = data => {
        options.setX(data.x)
        options.setY(data.y)
    }
    let getCoor = ratio => {
        return {
            x: currentX + disantceX * ratio,
            y: currentY + disantceY * ratio
        }
    }
    let createRatio = position => {
        // return pipe(, )
    }
    let subject = new Subject()
    let cancel$ = new Subject()
    pipe(
        subject,
        switchMapTo(ratio$),
        takeUnit(cancel$),
        map(getCoor),
        foreach(handleValue, resolve, reject)
    )

    let cancel = () => subject.next({ cacel: true })
    let redirect = position => suject.next({ position })

    return {
        start,
        cancel,
        redirect,
    }
}