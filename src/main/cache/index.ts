import { v4 as uuidv4 } from 'uuid'
import { ForcedAny } from '@shared/types'
import { info } from '@dev'
interface CachedFn {
  (...args: ForcedAny): ForcedAny
  cached?: boolean
}

// Memory cache which self-invalidates after a specific amount of time
export class TimedCache {
  cache: Record<string, ForcedAny> = {}
  timeouts: Record<string, ForcedAny> = {}
  timeout = 1000 * 60 * 30
  constructor(timeout?: number) {
    this.timeout = timeout ?? this.timeout
  }

  set(key: string, value: ForcedAny) {
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

  cached<Fn extends CachedFn>(fn: Fn): Fn {
    if (fn?.cached) {
      return fn
    }
    // Creates an identifier for this function
    const id = uuidv4()
    const wrappedFn = ((...args) => {
      const key = JSON.stringify({ id, args })
      if (this.has(key)) {
        info(`Using cache for ${fn?.name ?? 'Unknown'}:`, args)
        return this.get(key)
      }
      const result = fn(...args)
      if (typeof result?.then === 'function') {
        return result.then((x: ForcedAny) => {
          this.set(key, x)
          return x
        })
      }
      this.set(key, result)
      return result
    }) as Fn
    Object.defineProperty(wrappedFn, 'cached', { value: true })
    return wrappedFn
  }
}

export const timedCache = new TimedCache()

export const cached = timedCache.cached.bind(timedCache)
