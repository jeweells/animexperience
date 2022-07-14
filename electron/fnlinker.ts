let i = 0
const next = () => {
    return 'fnlinker__linked-' + i++
}
export interface IFn {
    (...args: any): any
}
export class LinkedFn {
    name: string
    debugName: string
    fn?: IFn
    constructor() {
        this.debugName = ''
        this.name = next()
    }

    link<Fn extends IFn>(fn: Fn): LinkedFn {
        this.debugName = fn.name || this.name
        this.fn = fn
        return this
    }
}
