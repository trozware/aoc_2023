const runPart1 = input => {
  const { pipes, sLocation } = parseInput(input)
  pipes[`${sLocation.row},${sLocation.col}`].connections = connectionsForS(
    sLocation,
    pipes
  )

  let nodesToTest = [`${sLocation.row},${sLocation.col}`]
  let visitedNodes = new Set()
  let distance = 0
  let nextNodes = []

  while (nodesToTest.length > 0) {
    const node = nodesToTest.shift()
    pipes[node].distance = distance
    visitedNodes.add(node)

    const connects = pipes[node].connections.filter(c => !visitedNodes.has(c))
    nextNodes = nextNodes.concat(connects)

    if (nodesToTest.length === 0) {
      nodesToTest = nextNodes
      nextNodes = []
      distance++
    }
  }

  const maxDistance = distance - 1
  return maxDistance

  // 6870
}

const runPart2 = input => {
  const { pipes, sLocation, dots } = parseInput(input)
  pipes[`${sLocation.row},${sLocation.col}`].connections = connectionsForS(
    sLocation,
    pipes
  )

  const gridHeight = input.length
  const gridWidth = input[0].length

  // Find the path
  let nodesToTest = [`${sLocation.row},${sLocation.col}`]
  let visitedNodes = new Set()
  let distance = 0
  let nextNodes = []
  let path = []
  let prefix = false

  while (nodesToTest.length > 0) {
    const node = nodesToTest.shift()
    pipes[node].distance = distance
    visitedNodes.add(node)

    if (prefix) {
      path.push(node)
    } else {
      path.unshift(node)
    }
    prefix = !prefix

    const connects = pipes[node].connections.filter(c => !visitedNodes.has(c))
    nextNodes = nextNodes.concat(connects)

    if (nodesToTest.length === 0) {
      nodesToTest = nextNodes
      nextNodes = []
      distance++
    }
  }

  path.pop()

  // assemble set of every node not used by path
  let unused = new Set(Object.keys(pipes).filter(p => !path.includes(p)))
  for (const dot of dots) {
    unused.add(dot)
  }

  // for each node in the path, work out which unused nodes are to the left and right
  // mark these differently as one set will be the enclosed set and one wil be outside.
  let nodesToLeft = new Set()
  let nodesToRight = new Set()

  for (let index = 0; index < path.length; index++) {
    let nextIndex = index + 1
    if (nextIndex >= path.length) {
      nextIndex = 0
    }
    let prevIndex = index - 1
    if (prevIndex < 0) {
      prevIndex = path.length - 1
    }
    const next = path[nextIndex]
    const prev = path[prevIndex]

    const start = path[index]
    const [r, c] = start.split(',')
    const surrounds = surroundingNodes(parseInt(r), parseInt(c))
    const nextSurround = surrounds.indexOf(next)
    const prevSurround = surrounds.indexOf(prev)

    let counter = 0
    let nextNodeIndex = nextSurround
    let metPrevNode = false

    while (counter < 8) {
      const nextNode = surrounds[nextNodeIndex]
      if (nextNodeIndex === prevSurround) {
        metPrevNode = true
      }

      if (unused.has(nextNode)) {
        if (metPrevNode) {
          nodesToLeft.add(nextNode)
        } else {
          nodesToRight.add(nextNode)
        }
        unused.delete(nextNode)
      }

      nextNodeIndex++
      if (nextNodeIndex >= 8) {
        nextNodeIndex = 0
      }
      counter++
    }
  }

  // for every node still unused, if it is touching a left or right node, add it to that set
  let unusedArr = Array.from(unused)
  let foundMatch = false

  while (true) {
    unusedArr = Array.from(unused)
    for (const node of unusedArr) {
      const [r, c] = node.split(',')
      const surrounds = surroundingNodes(parseInt(r), parseInt(c))
      const surroundedByLefts = surrounds.filter(s => nodesToLeft.has(s))
      if (surroundedByLefts.length > 0) {
        nodesToLeft.add(node)
        unused.delete(node)
        foundMatch = true
      }
      const surroundedByRights = surrounds.filter(s => nodesToRight.has(s))
      if (surroundedByRights.length > 0) {
        nodesToRight.add(node)
        unused.delete(node)
        foundMatch = true
      }
    }
    if (!foundMatch || unused.size === 0) {
      break
    }
  }

  printPipes(
    pipes,
    gridHeight,
    gridWidth,
    nodesToLeft,
    nodesToRight,
    path,
    unused
  )

  const totalNodes = gridHeight * gridWidth
  const totalLeft = nodesToLeft.size
  const totalRight = nodesToRight.size
  const pathLength = path.length

  console.log('total', totalNodes)
  console.log('left', totalLeft)
  console.log('right', totalRight)
  console.log('path', pathLength)
  console.log('unused', unused.size)
  console.log('total check', totalLeft + totalRight + pathLength + unused.size)

  // one of left or right will be the enclosed set, most likely the smallest
  return Math.min(totalLeft, totalRight)

  // 287
}

const parseInput = input => {
  let pipes = {}
  let dots = new Set()
  let sLocation = undefined

  for (const row in input) {
    for (const col in input[row].split('')) {
      const r = parseInt(row)
      const c = parseInt(col)
      const symbol = input[row][col]

      if (symbol === 'S') {
        sLocation = { row: r, col: c }
      }

      if (input[row][col] !== '.') {
        pipes[`${r},${c}`] = {
          symbol: symbol,
          connections: connections(symbol, r, c),
          distance: 0,
        }
      } else {
        dots.add(`${r},${c}`)
      }
    }
  }

  return { pipes, sLocation, dots }
}

const connections = (symbol, row, col) => {
  let connects = []
  let north = `${row - 1},${col}`
  let south = `${row + 1},${col}`
  let west = `${row},${col - 1}`
  let east = `${row},${col + 1}`

  switch (symbol) {
    case '|':
      connects.push(north)
      connects.push(south)
      break
    case '-':
      connects.push(west)
      connects.push(east)
      break
    case 'L':
      connects.push(north)
      connects.push(east)
      break
    case 'J':
      connects.push(north)
      connects.push(west)
      break
    case '7':
      connects.push(south)
      connects.push(west)
      break
    case 'F':
      connects.push(south)
      connects.push(east)
      break
  }
  return connects
}

const connectionsForS = (sLocation, pipes) => {
  const { row, col } = sLocation
  const north = `${row - 1},${col}`
  const south = `${row + 1},${col}`
  const west = `${row},${col - 1}`
  const east = `${row},${col + 1}`
  const sLoc = `${row},${col}`

  let connects = []
  if (pipes[north] && pipes[north].connections.includes(sLoc)) {
    connects.push(north)
  }
  if (pipes[south] && pipes[south].connections.includes(sLoc)) {
    connects.push(south)
  }
  if (pipes[west] && pipes[west].connections.includes(sLoc)) {
    connects.push(west)
  }
  if (pipes[east] && pipes[east].connections.includes(sLoc)) {
    connects.push(east)
  }
  return connects
}

const surroundingNodes = (row, col) => {
  let surrounds = []

  // 8  1  2
  // 7  S  3
  // 6  5  4

  surrounds.push(`${row - 1},${col}`)
  surrounds.push(`${row - 1},${col + 1}`)
  surrounds.push(`${row},${col + 1}`)
  surrounds.push(`${row + 1},${col + 1}`)
  surrounds.push(`${row + 1},${col}`)
  surrounds.push(`${row + 1},${col - 1}`)
  surrounds.push(`${row},${col - 1}`)
  surrounds.push(`${row - 1},${col - 1}`)

  return surrounds
}

const printPipes = (
  pipes,
  gridHeight,
  gridWidth,
  nodesToLeft,
  nodesToRight,
  path,
  unused
) => {
  let gridStr = ''
  for (let row = 0; row < gridHeight; row++) {
    let rowStr = ''
    for (let col = 0; col < gridWidth; col++) {
      const coord = `${row},${col}`
      if (nodesToLeft.has(coord)) {
        rowStr += 'I'
      } else if (nodesToRight.has(coord)) {
        rowStr += 'O'
      } else if (path && path.includes(coord)) {
        rowStr += '='
      } else if (unused && unused.has(coord)) {
        rowStr += '?'
      } else {
        rowStr += pipes[coord] ? pipes[coord].symbol : '.'
      }
    }
    gridStr += rowStr + '\n'
  }

  console.log(gridStr)
  return gridStr
}

module.exports = {
  runPart1,
  runPart2,
}
