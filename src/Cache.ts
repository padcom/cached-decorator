/**
 * Cache interface defining methods of a cache store
 */
export default interface Cache {
  /**
   * Checks if a given key exists in the cache
   *
   * @param context {*} context for the key
   * @param key {String} key to check if it exists
   */
  has(context: any, key: string): boolean

  /**
   * Sets a given key to the given value
   *
   * @param context {*} context for the key
   * @param key {*} key to set
   * @param value {*} value for the key
   */
  set(context: any, key: string, value: any): void

  /**
   * Gets a given key's value
   *
   * @param context {*} context for the key
   * @param key {String} key to get
   */
  get(context: any, key: string): any

  /**
   * Invalidates the given key
   *
   * @param context {*} context for the key
   * @param key {String} key to invalidate
   */
  invalidate(context: any, key: any): void
}
