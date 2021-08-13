let i = 0
const next = () => {
    return 'fnlinker__linked-' + i++
}
export interface IFn {
    (...args: any): any
}
export class LinkedFn {
    name: string
    fn?: IFn
    constructor() {
        this.name = next()
    }

    link<Fn extends IFn>(fn: Fn): LinkedFn {
        this.fn = fn
        return this
    }
}
