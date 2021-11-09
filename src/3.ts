// Day 3: Status readings
import { test, parseInput } from './helpers'

const bitCountToNumber = (bc: string[]) => (
  parseInt(bc.join(''), 2)
)

type NodeValue = '0'|'1'|''

class BinaryTrieNode {
  links: { '0'?: BinaryTrieNode, '1'?: BinaryTrieNode }
  count: number // number of entries that pass through this node
  value: NodeValue

  constructor(value: NodeValue, nextSequence?: string) {
    this.count = 0
    this.links = { }
    this.value = value
    this.insert(nextSequence)
  }

  insert(sequence?: string) {
    this.count += 1

    // If there is remaining sequence to record, find the next node and keep recording
    if (sequence && sequence.length > 0) {
      const nextValue = sequence.charAt(0) as NodeValue
      const nextSequence = sequence.slice(1)

      if (nextValue) {
        if (this.links[nextValue] instanceof BinaryTrieNode) {
          this.links[nextValue]?.insert(nextSequence)
        } else {
          this.links[nextValue] = new BinaryTrieNode(nextValue, nextSequence)
        }
      }
    }
  }

  getLinksAsc(): BinaryTrieNode[] {
    const links = Object.values(this.links)

    if ((links.length > 1) && (links[0].count > links[1].count)) {
      links.reverse()
    }

    return links
  }

  getXPopularLink(x: 'least'|'most'): BinaryTrieNode {
    return x === 'least'
    ? this.getLinksAsc().shift() as BinaryTrieNode
    : this.getLinksAsc().pop() as BinaryTrieNode
  }
}

class BinaryTrie {
  root: BinaryTrieNode

  constructor(sequences: string[]) {
    this.root = new BinaryTrieNode('')
    sequences.forEach((seq) => this.root.insert(seq))
  }

  walk(fn: (value: NodeValue|'', count: number, depth: number) => any, node=this.root, depth=0) {
    fn(node.value || '', node.count, depth)
    depth += 1
    Object.values(node.links).forEach((l) => this.walk(fn, l, depth))
  }

  getXPopularPath(x: 'least'|'most', path: BinaryTrieNode[]=[], node=this.root) {
    if (Object.keys(node.links).length > 0) {
      const xPopularLink = node.getXPopularLink(x)
      path.push(xPopularLink)

      this.getXPopularPath(x, path, xPopularLink)
    }

    return path

  }
  getXCommonBitByDepth(x: 'least' | 'most') {
    const counts: { '0': number, '1': number }[] = []

    this.walk((value, count, depth) => {
      if (!value || depth === 0) { return }
      if (counts[depth - 1]) { counts[depth - 1][value] += count }
      else {
        counts.push({
          0: value === '0' ? count : 0,
          1: value === '1' ? count : 0,
        })
      }
    })

    return counts.map((c) => {
      if ((x === 'most' && c['0'] > c['1']) ||
          (x === 'least' && c['0'] < c['1'])) { return '0' }
      else { return '1' }
    })
  }

  print() {
    this.walk((value, count, depth) => (
      console.log(`${' '.repeat(depth*2)} node name: ${value} | paths through this node: ${count}`)
    ))
  }
}

// gamma rating: most common bit
const getGammaRate = (trie: BinaryTrie) => {
  const mostCommon = trie.getXCommonBitByDepth('most')
  return bitCountToNumber(mostCommon)
}

// epsilon rating: least common bit
const getEpsilonRate = (trie: BinaryTrie) => {
  const leastCommon = trie.getXCommonBitByDepth('least')
  return bitCountToNumber(leastCommon)
}

// power rate (most common bit * least common bit)
const getPowerRate = (trie: BinaryTrie) => {
  const gammaRate = getGammaRate(trie)
  const epsilonRate = getEpsilonRate(trie)

  return gammaRate * epsilonRate
}

// oxygen generator rating: most popular path
const getOxygenGeneratorRating = (trie: BinaryTrie) => {
  const path = trie.getXPopularPath('most')
  return path.map((node) => node.value).join('')
}

// CO2 scrubber rating: least popular path
const getCO2ScrubberRating = (trie: BinaryTrie) => {
  const path = trie.getXPopularPath('least')
  return path.map((node) => node.value).join('')
}

// life support rating: most common * least common
const getLifeSupportRating = (trie: BinaryTrie) => {
  const oxRating = getOxygenGeneratorRating(trie)
  const co2Rating = getCO2ScrubberRating(trie)

  return parseInt(oxRating, 2) * parseInt(co2Rating, 2)
}

//////// Tests
const testInput = [ '00100', '11110', '10110', '10111', '10101', '01111', '00111', '11100', '10000', '11001', '00010', '01010', ]
const testTrie = new BinaryTrie(testInput)
testTrie.print()

// Part 1
test('sample gamma rate', 22, () => getGammaRate(testTrie))
test('sample epsilon rate', 9, () => getEpsilonRate(testTrie))
test('sample power rate', 198, () => getPowerRate(testTrie))

// Part 2
test('sample oxygen generator rating', '10111', () => getOxygenGeneratorRating(testTrie))
test('sample co2 scrubber rating', '01010', () => getCO2ScrubberRating(testTrie))
test('sample life support rating', 230, () => getLifeSupportRating(testTrie))

////// Real input
parseInput('src/3.input').then((input: string[]) => {
  const realTrie = new BinaryTrie(input)

  console.log("power rate: ", getPowerRate(realTrie))
  console.log("life support rating: ", getLifeSupportRating(realTrie))
})

