import { parseInput } from './helpers'

type Accumulator = { last: null|number; increases: number }

export const getIncreases = (input: number[]) => (
  input.reduce((acc: Accumulator, val) => {
    if (acc.last && val > acc.last) { acc.increases += 1 }

    acc.last = val
    return acc

  }, { last: null, increases: 0 } as Accumulator).increases
)

const getWindowedIncreases = (input: number[]) => {
  const windows = input.reduce((acc: number[], val, idx) => {
    // If there aren't 3 values to put in a window, bail
    if (idx + 3 > input.length) { return acc }

    acc.push(val + input[idx+1] + input[idx+2])

    return acc

  }, [])

  return getIncreases(windows)
}

parseInput('src/1.input').then((input: string[]) => {
  const numbers = input.map((str) => parseInt(str))

  console.log("increases", getIncreases(numbers))
  console.log("windowed increases", getWindowedIncreases(numbers))
})
