// Day 2: Submarine navigation
import { test, parseInput } from './helpers'

type Accumulator = { h: number; d: number, aim: number }

const getPosition = (input: string[]) => (
  input.reduce((acc: Accumulator, val) => {
    const [ direction, strSteps ] = val.split(' ')
    const steps = parseInt(strSteps)

    if (direction === 'up') { acc.aim -= steps }
    if (direction === 'down') { acc.aim += steps }

    if (direction === 'forward') {
      acc.h += steps
      acc.d += acc.aim * steps
    }

    return acc

  }, { h: 0, d: 0, aim: 0 } as Accumulator)
)

// Real input
parseInput('src/2.input').then((input: string[]) => {
  const output = getPosition(input)
  console.log("output", output.h * output.d)
})

// Forward test
const forwardTest = [ 'forward 1', 'forward 5' ]
test('forward test', { h: 6, d: 0 }, () => getPosition(forwardTest))

// Down test
const downTest = [ 'down 10', 'down 8' ]
test('down test', { h: 0, d: 0, aim: 18 }, () => getPosition(downTest))

// Aim test
const aimTest = [ 'forward 1', 'down 10', 'forward 5' ]
test('aim test', { h: 6, d: 50, aim: 10 }, () => getPosition(aimTest))
