import React from 'react'
import { Optional, FStatus } from '../../types'

export class Suspended extends Error {}

type UnmanagedPromise = { promise: Promise<any>; resolve(): void; reject(): void }
const createPromise = (): UnmanagedPromise => {
    const r: Partial<UnmanagedPromise> = {}
    r.promise = new Promise((resolve, reject) => {
        r.resolve = resolve
        r.reject = reject
    })
    return r as any as UnmanagedPromise
}

export const useAssertStatus = (status: Optional<FStatus>) => {
    const [up, setUp] = React.useState<UnmanagedPromise | null>(null)
    React.useLayoutEffect(() => {
        if (up === null) {
            if (status === 'idle' || status === 'loading') {
                setUp(createPromise())
            }
        } else if (status !== 'idle' && status !== 'loading') {
            if (status === 'failed') {
                up.reject()
            } else {
                up.resolve()
            }
        }
    }, [status])
    if (status === 'idle' || status === 'loading') {
        throw up.promise
    }
}
