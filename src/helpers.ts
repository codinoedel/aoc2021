import { readFile } from 'fs/promises'

const readOpts = { flag: 'r'}

export const parseInput = (fName: string) => (
  readFile(fName, readOpts).then((contents) =>
    contents
      .toString()
      .trim()
      .split('\n'))
)

export const test = (name: string, expected: any, testFn: () => any) => {
  console.log('\n***TEST***: : ', name)
  console.log('EXPECTED: ', expected)

  const actual = testFn()
  console.log(`ACTUAL: ${actual}\n`)
}
