import Cache from './Cache'

/**
 * Memory-based cache implementation
 */
export default class MemoryCache implements Cache {
  private readonly timeout: number
  private readonly updateOnGet: boolean = false
  private cache = new Map<any, Map<any, any>>()

  /**
   * Constructs an instance of MemoryCache.
   *
   * When constructing an instance of the cache you can decide if the cached value
   * will be automatically evicted after a specific time or
   *
   * @param timeout {Number} cache timeout in ms (default: Number.POSITIVE_INFINITY)
   * @param updateOnGet {Boolean} refresh key's time when fetching (default: false)
   */
  constructor(timeout = Number.POSITIVE_INFINITY, updateOnGet = false) {
    this.timeout = timeout
    this.updateOnGet = updateOnGet
  }

  /**
   * Destroy this instance of MemoryCache and cleans up the resources
   */
  destroy() {
    this.cache.forEach(context => {
      context.forEach(key => {
        this.releaseTimer(context, key)
      })
    })
  }

  has(context: any, key: any): boolean {
    return this.cache.has(context) && !!this.cache.get(context)?.has(key)
  }

  set(context: any, key: any, value: any): void {
    this.invalidate(context, key)
    if (!this.cache.has(context)) {
      this.cache.set(context, new Map<any, any>())
    }
    this.cache.get(context)?.set(key, { value })
    this.updateItemTimer(context, key)
  }

  private updateItemTimer(context: any, key: any) {
    this.releaseTimer(context, key)
    if (this.cache.get(context)?.has(key)) {
      const entry = this.cache.get(context)?.get(key)
      if (this.timeout !== Number.POSITIVE_INFINITY) {
        entry.timeout = setTimeout(() => this.invalidate(context, key), this.timeout, null)
      }
    }
  }

  private releaseTimer(context: any, key: any) {
    if (this.cache.get(context)?.has(key)) {
      const entry = this.cache.get(context)?.get(key)
      if (entry.timeout) {
        clearInterval(entry.timeout)
        delete entry.timeout
      }
    }
  }

  get(context: any, key: string): any {
    if (this.has(context, key)) {
      if (this.updateOnGet) {
        this.updateItemTimer(context, key)
      }

      return this.cache.get(context)?.get(key)?.value
    } else {
      throw new Error('Value not cached')
    }
  }

  invalidate(context: any, key: any) {
    this.releaseTimer(context, key)
    if (this.cache.has(context)) {
      this.cache.get(context)?.delete(key)
      if (this.cache.get(context)?.size === 0) {
        this.cache.delete(context)
      }
    }
  }
}
