import ObjectCache from './ObjectCache'

describe('ObjectCache', () => {
  const KEY = 'x', VALUE1 = '1', VALUE2 = '2'

  async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  it('will cache value', () => {
    // given
    const instance: any = {}
    const cache = new ObjectCache()

    // when
    cache.set(instance, KEY, VALUE1)
    const actual = cache.get(instance, KEY)

    // then
    expect(actual).toBe(VALUE1)
    expect(instance.__cache__.get(KEY)).toStrictEqual({ value: VALUE1 })
  })

  it('will invalidate cached value after timeout', async () => {
    // given
    const instance: any = {}
    const cache = new ObjectCache(10)

    // when
    cache.set(instance, KEY, '123')
    const actual1 = cache.has(instance, KEY)
    await sleep(11)
    const actual2 = cache.has(instance, KEY)

    // then
    expect(actual1).toBe(true)
    expect(actual2).toBe(false)
    expect(instance.__cache__.get(KEY)).toBeUndefined()
  })

  it('will distinguish between instances of objects', () => {
    // given
    const cache = new ObjectCache()
    const instance1 = {}
    const instance2 = {}

    // when
    cache.set(instance1, KEY, VALUE1)
    cache.set(instance2, KEY, VALUE2)

    // then
    expect(cache.get(instance1, KEY)).toBe(VALUE1)
    expect(cache.get(instance2, KEY)).toBe(VALUE2)
  })


  it('will refresh cached timestamp on getting value', async () => {
    // given
    const cache = new ObjectCache(10, true)
    const instance = {}

    // when
    cache.set(instance, KEY, VALUE1)
    const actual1 = cache.has(instance, KEY)

    // Testing cumulative impact of passing time.
    // Each "sleep" adds a few miliseconds.
    // Each call to "cache.get()" should reset the time of a given entry.
    await sleep(5)
    cache.get(instance, KEY)
    const actual2 = cache.has(instance, KEY)

    await sleep(5)
    cache.get(instance, KEY)
    const actual3 = cache.has(instance, KEY)

    await sleep(5)
    const actual4 = cache.has(instance, KEY)

    await sleep(5)
    const actual5 = cache.has(instance, KEY)

    // then
    expect(actual1).toBe(true)
    expect(actual2).toBe(true)
    expect(actual3).toBe(true)
    expect(actual4).toBe(true)
    expect(actual5).toBe(false)
  })
})
