import MemoryCache from './MemoryCache'

function isPromise(p: any) {
  return p && Object.prototype.toString.call(p) === "[object Promise]"
}

/**
 * Decorator for caching method calls.
 *
 * @param timeout {number} Timeout when the data will be considered outdated
 */
export default function Cached(
  timeout = Number.POSITIVE_INFINITY,
  cache = new MemoryCache(timeout),
) {
  return function (_target: any, _property: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    descriptor.value = function(...args: any[]) {
      const key  = args.toString()
      if (!cache.has(this, key)) {
        const result = originalMethod.apply(this, args)
        if (isPromise(result)) {
          return result.then((value: any) => {
            cache.set(this, key, value)
            return value
          })
        } else {
          cache.set(this, key, result)
        }
      }
      return cache.get(this, key)
    }
  }
}
