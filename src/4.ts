// Day 4: Bingo
import { parseInput, test } from './helpers'

interface Matches {
  rows: Record<string, number[]>
  cols: Record<string, number[]>
}

class Board {
  values: number[]
  matches: Matches
  isWinner: boolean
  score: number

  constructor(values: number[]) {
    this.values = values
    this.matches = { rows: {}, cols: {} }
    this.isWinner = false
    this.score = 0
  }

  addCall(call: number) {
    const matchIdx = this.values.findIndex((val) => val === call)

    // if we have a match...
    if (matchIdx !== -1) {
      const row = Math.floor(matchIdx / 5).toString()
      const col = (matchIdx % 5).toString()

      // record a match for the row in which the call is found on this board
      if (!this.matches.rows[row]) { this.matches.rows[row] = [ call ] }
      else { this.matches.rows[row].push(call) }

      // record a match for the column in which the call is found on this board
      if (!this.matches.cols[col]) { this.matches.cols[col] = [ call ] }
      else { this.matches.cols[col].push(call) }

      // if the length of either of these is now 5, mark this as a winning board
      if (this.matches.rows[row].length === 5 || this.matches.cols[col].length === 5) {
        this.isWinner = true
        this.score = this.setScore(call)
      }
    }
  }

  getIsWinner() {
    return this.isWinner
  }

  setScore(call: number) {
    const markedNumbers = Array.of(...Object.values(this.matches.rows)).flat()
    const unmarkedNumbers = this.values.filter((v) => !markedNumbers.includes(v))
    const unmarkedSum = unmarkedNumbers.reduce((sum, un) => sum + un, 0)
    return unmarkedSum * call
  }

  getScore() {
    return this.score
  }
}

class GameTable {
  boards: Board[]
  scores: number[]

  constructor(boardsValues: number[][]) {
    this.boards = boardsValues.map((bvs) => new Board(bvs))
    this.scores = []
  }

  addCall(call: number) {
    // add the call to each board that hasn't already won
    this.boards.forEach((b) => {
      if (!b.getIsWinner()) {
        b.addCall(call)
        if (b.getIsWinner()) { this.scores.push(b.getScore()) }
      }
    })
  }

  getScores() {
    return this.scores
  }
}

const getAllWinningScores = (callSequence: number[], boardValues: number[][]) => {
  const gameTable = new GameTable(boardValues)

  callSequence.forEach((call) =>  gameTable.addCall(call))
  return gameTable.getScores()
}

const testCallSequence = [ 7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1 ]
const testBoardValues = [
  [ 22, 13, 17, 11,  0,
     8,  2, 23,  4, 24,
    21,  9, 14, 16,  7,
     6, 10,  3, 18,  5,
     1, 12, 20, 15, 19 ],

  [  3, 15,  0,  2, 22,
     9, 18, 13, 17,  5,
    19,  8,  7, 25, 23,
    20, 11, 10, 24,  4,
    14, 21, 16, 12,  6 ],

  [ 14, 21, 17, 24,  4,
    10, 16, 15,  9, 19,
    18,  8, 23, 26, 20,
    22, 11, 13,  6,  5,
     2,  0, 12,  3,  7 ],
]

test('get all winning scores', [ 4512, 0, 0 ],
  () => getAllWinningScores(testCallSequence, testBoardValues))

parseInput('src/4.input').then((input: string[]) => {
  // first line is call sequence
  const callSequence = input.shift()?.split(',').map((c) => parseInt(c)) || []

  const boardValues = input.reduce((acc: number[][], line: string) => {
    // if this input line is an empty row, create a new board
    if (line.length === 0) { acc.push([]) }
    // otherwise, add this line to the board we're working on building
    else {
      let nums: number[] = line.split(' ').map((v) => parseInt(v))
      acc[acc.length - 1]?.push(...nums)
    }

    return acc
  }, [])

  const scores = getAllWinningScores(callSequence, boardValues)
  const firstWinner = scores[0]
  const lastWinner = scores[scores.length - 1]

  console.log('board scores', scores)
  console.log('first winner', firstWinner)
  console.log('last winner', lastWinner)
})
