let fromList = list => {
    console.log('callback =>', list)
    // from(list).subscribe({
    //     next: (e) => console.log('secondRx => ', e)
    // })
}
interval().pipe(
    take(10),
    map(next => {
        if (next % 2 === 0) {
            return [next, 100 + next]
        } else {
            return next
        }
    }),
    mergeMap(x => {
        // console.log('x => ', x)
        return Array.isArray(x) ? from(x) : of(x)
    })
).subscribe({
    next: fromList
})