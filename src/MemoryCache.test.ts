import MemoryCache from './MemoryCache'

describe('MemoryCache', () => {
  const KEY = 'x', VALUE = 1

  async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  type TestCallback = (cache: MemoryCache) => Promise<void> | void
  /**
   * Helper function to enable automatic disposal of MemoryCache resources
   */
  function test(name: string, cache: MemoryCache, callback: TestCallback) {
    afterAll(() => cache.destroy())
    it(name, async () => await Promise.resolve(callback(cache)))
  }

  test('will cache value', new MemoryCache(), cache => {
    // given
    cache.set(this, KEY, VALUE)

    // when
    const actual = cache.get(this, KEY)

    // then
    expect(actual).toBe(VALUE)
  })

  test('will distinguish between instances of objects', new MemoryCache(), cache => {
    const instance1 = {}
    cache.set(instance1, KEY, VALUE)
    const instance2 = {}
    cache.set(instance2, KEY, '2')

    expect(cache.get(instance1, KEY)).toBe(VALUE)
    expect(cache.get(instance2, KEY)).toBe('2')
  })

  test('will allow to invalidate cached value', new MemoryCache(), cache => {
    // given
    cache.set(this, KEY, VALUE)

    // when
    const actual1 = cache.has(this, KEY)
    cache.invalidate(this, KEY)
    const actual2 = cache.has(this, KEY)

    // then
    expect(actual1).toBe(true)
    expect(actual2).toBe(false)
  })

  test('will timeout cached value', new MemoryCache(10), async (cache) => {
    // given
    cache.set(this, KEY, VALUE)

    // when
    const actual1 = cache.has(this, KEY)
    await sleep(10)
    const actual2 = cache.has(this, KEY)

    // then
    expect(actual1).toBe(true)
    expect(actual2).toBe(false)
  })

  test('will refresh cached timestamp on getting value', new MemoryCache(10, true), async (cache) => {
    // given
    cache.set(this, KEY, VALUE)

    // when
    const actual1 = cache.has(this, KEY)

    // Testing cumulative impact of passing time.
    // Each "sleep" adds a few miliseconds.
    // Each call to "cache.get()" should reset the time of a given entry.
    await sleep(5)
    cache.get(this, KEY)
    const actual2 = cache.has(this, KEY)

    await sleep(5)
    cache.get(this, KEY)
    const actual3 = cache.has(this, KEY)

    await sleep(5)
    const actual4 = cache.has(this, KEY)

    await sleep(5)
    const actual5 = cache.has(this, KEY)

    // then
    expect(actual1).toBe(true)
    expect(actual2).toBe(true)
    expect(actual3).toBe(true)
    expect(actual4).toBe(true)
    expect(actual5).toBe(false)
  })
})
