const { lastElement } = require('../utils')

const runPart1 = input => {
  const { pipes, sLocation } = parseInput(input)
  pipes[`${sLocation.row},${sLocation.col}`].connections = connectionsForS(
    sLocation,
    pipes,
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
    pipes,
  )

  // let lastCount = Object.keys(pipes).length
  // let validPipes = pipes
  // while (true) {
  //   validPipes = removeInvalidPipes(validPipes)
  //   if (Object.keys(validPipes).length === lastCount) {
  //     break
  //   }
  //   lastCount = Object.keys(validPipes).length
  // }
  // console.log(validPipes)
  const validPipes = pipes

  let nodesToTest = [`${sLocation.row},${sLocation.col}`]
  let visitedNodes = new Set()
  let distance = 0
  let nextNodes = []
  let path = []
  let prefix = false

  while (nodesToTest.length > 0) {
    const node = nodesToTest.shift()
    validPipes[node].distance = distance
    visitedNodes.add(node)

    if (prefix) {
      path.push(node)
    } else {
      path.unshift(node)
    }
    prefix = !prefix

    const connects = validPipes[node].connections.filter(
      c => !visitedNodes.has(c),
    )
    nextNodes = nextNodes.concat(connects)

    if (nodesToTest.length === 0) {
      nodesToTest = nextNodes
      nextNodes = []
      distance++
    }
  }

  path.pop()
  console.log(path)

  let unused = new Set(Object.keys(validPipes).filter(p => !path.includes(p)))
  for (const dot of dots) {
    unused.add(dot)
  }
  // console.log(unused)

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

    const start = path[index]
    const [r, c] = start.split(',')
    const surrounds = surroundingNodes(parseInt(r), parseInt(c))
    const next = path[nextIndex]
    const prev = path[prevIndex]

    let startIndex = surrounds.indexOf(prev)
    let endIndex = surrounds.indexOf(next)
    for (let i = startIndex + 1; i <= endIndex; i++) {
      const surround = surrounds[i]
      // console.log(i, surround)
      if (unused.has(surround)) {
        nodesToLeft.add(surround)
      }
    }
    for (let i = endIndex - 1; i <= surrounds.length; i++) {
      const surround = surrounds[i]
      // console.log(i, surround)
      if (unused.has(surround)) {
        nodesToRight.add(surround)
      }
    }
  }

  let nLeftArr = Array.from(nodesToLeft).sort()
  let nRightArr = Array.from(nodesToRight).sort()

  console.log('left', nLeftArr.length)
  console.log(nLeftArr)
  console.log('right', nRightArr.length)
  console.log(nRightArr)
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

const removeInvalidPipes = pipes => {
  const coords = Object.keys(pipes)
  const validPipes = {}

  for (const coord of coords) {
    if (pipes[coord].connections.length !== 2) {
      return false
    }

    const connects = pipes[coord].connections.filter(c => {
      if (!coords.includes(c)) {
        return false
      }

      const connectedNodes = pipes[c].connections
      if (!connectedNodes.includes(coord)) {
        return false
      }
      return true
    })

    if (connects.length === 2) {
      validPipes[coord] = pipes[coord]
    }
  }

  return validPipes
}

module.exports = {
  runPart1,
  runPart2,
}
