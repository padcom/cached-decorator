import Cache from './Cache'

export default class ObjectCache implements Cache {
  private readonly timeout: number
  private readonly updateOnGet

  /**
   * Constructs an instance of ObjectCache.
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

  set(context: any, key: any, value: any) {
    this.invalidate(context, key)

    if (context.__cache__ === undefined) {
      Object.defineProperty(context, '__cache__', {
        configurable: false,
        // enumerable: false,
        writable: false,
        value: new Map(),
      })
    }

    context.__cache__.set(key, { value })
    this.resetEntryTimeoutHandler(context, key)
  }

  private resetEntryTimeoutHandler(context: any, key: any) {
    if (context.__cache__?.has(key)) {
      const entry = context.__cache__.get(key)
      clearTimeout(entry.timeout)
      if (this.timeout !== Number.POSITIVE_INFINITY) {
        entry.timeout = setTimeout(() => { this.invalidate(context, key) }, this.timeout, null)
      }
    }
  }

  get(context: any, key: any) {
    if (context.__cache__?.has(key)) {
      if (this.updateOnGet) {
        this.resetEntryTimeoutHandler(context, key)
      }
      return context.__cache__.get(key)?.value
    } else {
      throw new Error(`Value for key '${key}' not found`)
    }
  }

  has(context: any, key: any) {
    return !!context.__cache__?.get(key)
  }

  invalidate(context: any, key: any) {
    if (context.__cache__?.has(key)) {
      const item = context.__cache__.get(key)
      clearTimeout(item.timeout)
      context.__cache__?.delete(key)
    }
  }
}
