import Cached from "./Cached"

describe('Cached', () => {
  async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  it('will cache method call', () => {
    // given
    class Test {
      counter = 0

      @Cached()
      method(x: string) {
        this.counter++
        return x
      }
    }

    // when
    const instance1 = new Test()
    instance1.method('a')
    instance1.method('a')

    const instance2 = new Test()
    instance2.method('a')
    instance2.method('a')

    // then
    expect(instance1.counter).toBe(1)
    expect(instance2.counter).toBe(1)
  })

  it('will invalidate cache method call after timeout', async () => {
    // given
    class Test {
      counter = 0

      @Cached(10)
      method(x: string) {
        this.counter++
        return x
      }
    }

    // when
    const instance = new Test()
    instance.method('a')
    await sleep(10)
    instance.method('a')

    // then
    expect(instance.counter).toBe(2)
  })
})
