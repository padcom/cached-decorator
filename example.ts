import Cached from '.'

class Program {
  @Cached(100)
  calc(x: number) {
    console.log('PROGRAM: Calculating for x =', x)
    return Promise.resolve(x**x)
  }
}

async function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

async function main() {
  const program = new Program()
  console.log('MAIN: [1]', await program.calc(1))
  console.log('MAIN: [2]', await program.calc(1))
  await sleep(101)
  console.log('MAIN: [3]', await program.calc(1))
  process.exit()
}

main()
