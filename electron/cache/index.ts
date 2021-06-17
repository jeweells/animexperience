// Memory cache which self-invalidates after a specific amount of time
export class TimedCache {
    cache: Record<string, any> = {}
    timeouts: Record<string, any> = {}
    timeout = 1000 * 60 * 30
    constructor(timeout?: number) {
        this.timeout = timeout ?? this.timeout
    }

    set(key: string, value: any) {
        const oldTimeout = this.timeouts[key]
        if (oldTimeout ?? false) {
            clearTimeout(oldTimeout)
        }
        this.cache[key] = value
        this.timeouts[key] = setTimeout(() => {
            delete this.cache[key]
        }, this.timeout)
    }

    has(key: string) {
        return key in this.cache
    }

    get(key: string) {
        return this.cache[key]
    }

    cached<Fn extends (...args: any) => any>(id: string, fn: Fn): Fn {
        const wrappedFn = ((...args) => {
            const key = JSON.stringify({ id, args })
            if (this.has(key)) {
                console.debug(`Using cache for ${fn?.name ?? 'Unknown'}:`, args)
                return this.get(key)
            }
            const result = fn(...args)
            if (typeof result?.then === 'function') {
                return result.then((x: any) => {
                    this.set(key, x)
                    return x
                })
            }
            this.set(key, result)
            return result
        }) as Fn
        Object.defineProperty(wrappedFn, 'name', { value: fn.name })
        return wrappedFn
    }
}

export const timedCache = new TimedCache()

export const cached = timedCache.cached.bind(timedCache)
