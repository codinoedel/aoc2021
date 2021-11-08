// Day 3: Status readings
import { test, parseInput } from './helpers'

// Power rating
interface BitCount {
  zero: number
  one: number
}

const getBitCounts = (input: string[]) => (
  input.reduce((acc: BitCount[], binary: string) => {
    binary.split('').forEach((b, idx) => {
      // If we don't have a node for this position, make one
      if (!acc[idx]) {
        acc.push({
          zero: b === '0' ? 1 : 0,
          one: b === '1' ? 1 : 0,
        })
      }

      // Otherwise, increment values as needed
      else {
        if (b === '0') { acc[idx].zero += 1 }
        else { acc[idx].one += 1 }
      }

    })

    return acc
  }, [])
)

const bitCountToNumber = (bc: string[]) => (
  parseInt(bc.join(''), 2)
)

const getGammaRate = (bitCounts: BitCount[]) => {
  const mostCommon = bitCounts.map((bc: BitCount) => {
    if (bc.zero > bc.one) { return '0' }
    else { return '1' }
  }, [])

  return bitCountToNumber(mostCommon)
}

const getEpsilonRate = (bitCounts: BitCount[]) => {
  const leastCommon = bitCounts.map((bc: BitCount) => {
    if (bc.zero < bc.one) { return '0' }
    else { return '1' }
  }, [])

  return bitCountToNumber(leastCommon)
}

const getPowerRate = (input: string[]) => {
  const bitCounts = getBitCounts(input)
  console.log('bit counts', bitCounts)

  const gammaRate = getGammaRate(bitCounts)
  console.log('gamma rate', gammaRate)

  const epsilonRate = getEpsilonRate(bitCounts)
  console.log('epsilon rate', epsilonRate)

  return gammaRate * epsilonRate
}

type NodeValue = string

class TrieNode {
  links: Record<string, TrieNode> // record of links from this node
  count: number // number of links to this node
  value?: NodeValue

  constructor(value?: NodeValue, nextSequence?: string) {
    this.links = {}
    this.count = 0

    if (value) { this.value = value }
    if (nextSequence) { this.insert(nextSequence) }
  }

  insert(sequence: string) {
    this.count += 1

    // If there is remaining sequence to record, find the next node and keep recording
    if (sequence.length > 0) {
      const nextValue = sequence.charAt(0)
      const nextSequence = sequence.slice(1)

      if (this.links.hasOwnProperty(nextValue)) {
        this.links[nextValue].insert(nextSequence)
      } else {
        this.links[nextValue] = new TrieNode(nextValue, nextSequence)
      }
    }
  }

  getLinksAsc() {
    return Object.values(this.links).sort((node1, node2) => {
      // Attempt to sort by most popular
      if (node1.count < node2.count) { return -1 }
      if (node1.count > node2.count) { return 1 }

      // If node counts are equal, sort zeroes first
      if (node1.value === '0') { return -1 }
      else { return 1 }
    })
  }

  getMostPopularLink(): TrieNode {
    return this.getLinksAsc().pop() as TrieNode
  }

  getLeastPopularLink(): TrieNode {
    return this.getLinksAsc().shift() as TrieNode
  }
}

class Trie {
  root: TrieNode

  constructor(sequences: string[]) {
    this.root = new TrieNode()
    sequences.forEach((seq) => this.root.insert(seq))
  }

  walk(fn: (value: NodeValue, count: number, depth: number) => any, node=this.root, depth=0) {
    fn(node.value || '', node.count, depth)
    Object.values(node.links).forEach((l) => this.walk(fn, l, depth+=1))
  }

  getMostPopularPath(path: TrieNode[] = [], node=this.root) {
    if (Object.keys(node.links).length > 0) {
      const mostPopularLink = node.getMostPopularLink()
      path.push(mostPopularLink)

      this.getMostPopularPath(path, mostPopularLink)
    }

    return path
  }

  getLeastPopularPath(path: TrieNode[] = [], node=this.root) {
    if (Object.keys(node.links).length > 0) {
      const leastPopularLink = node.getLeastPopularLink()
      path.push(leastPopularLink)

      this.getLeastPopularPath(path, leastPopularLink)
    }

    return path
  }

  print() {
    this.walk((value, count, depth) => (
      console.log(`${' '.repeat(depth*2)} node name: ${value} | paths through this node: ${count}`)
    ))
  }
}

const testInput = [ '00100', '11110', '10110', '10111', '10101', '01111', '00111', '11100', '10000', '11001', '00010', '01010', ]

test('sample power test', 198, () => getPowerRate(testInput))

// Trie test
const trie = new Trie(testInput)
trie.print()

// oxygen generator rating (most common path)
const getOxygenGeneratorRating = (trie: Trie) => {
  const path = trie.getMostPopularPath()
  return path.map((node) => node.value).join('')
}

console.log('oxygen generator rating', getOxygenGeneratorRating(trie))

const getCO2ScrubberRating = (trie: Trie) => {
  const path = trie.getLeastPopularPath()
  return path.map((node) => node.value).join('')
}

console.log('CO2 scrubber rating', getCO2ScrubberRating(trie))

const getLifeSupportRating = (trie: Trie) => {
  const oxRating = getOxygenGeneratorRating(trie)
  const co2Rating = getCO2ScrubberRating(trie)

  return parseInt(oxRating, 2) * parseInt(co2Rating, 2)
}

// Real input
parseInput('src/3.input').then((input: string[]) => {
  console.log("power rate: ", getPowerRate(input))

  const realTrie = new Trie(input)
  console.log("life support rating: ", getLifeSupportRating(realTrie))
})

