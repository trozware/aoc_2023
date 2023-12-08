const { lcm } = require('../utils')

const runPart1 = input => {
  const { directions, nodes } = parseInput(input)

  let currentNode = 'AAA'
  let index = 0
  let steps = 0

  while (currentNode !== 'ZZZ') {
    const dir = directions[index]
    if (dir === 'L') {
      currentNode = nodes[currentNode].left
    } else if (dir === 'R') {
      currentNode = nodes[currentNode].right
    }
    steps++
    index++
    if (index >= directions.length) {
      index = 0
    }
  }

  return steps

  // 11309
}

const runPart2 = input => {
  const { directions, nodes } = parseInput(input)

  let startNodes = Object.keys(nodes).filter(node => node.endsWith('A'))

  let allSteps = []
  for (const node of startNodes) {
    const steps = nodeToZ(node, nodes, directions)
    allSteps.push(steps)
  }

  const lowest = allSteps.reduce((a, b) => lcm(a, b))
  return lowest

  // 13740108158591
}

const parseInput = input => {
  const directions = input[0].split('')
  input = input.slice(2)

  const nodes = {}
  for (const line of input) {
    const [node, destinations] = line.split(' = ')
    const trimmedDestinations = destinations.slice(1, -1)
    const [left, right] = trimmedDestinations.split(', ')
    nodes[node] = { left, right }
  }

  return { directions, nodes }
}

const nodeToZ = (node, nodes, directions) => {
  let currentNode = node
  let index = 0
  let steps = 0

  while (currentNode.endsWith('Z') === false) {
    const dir = directions[index]
    if (dir === 'L') {
      currentNode = nodes[currentNode].left
    } else if (dir === 'R') {
      currentNode = nodes[currentNode].right
    }

    steps++
    index++
    if (index >= directions.length) {
      index = 0
    }
  }

  return steps
}

module.exports = {
  runPart1,
  runPart2,
}
