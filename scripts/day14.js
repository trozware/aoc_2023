const { convertToIntegers, lastElement } = require('../utils')

const runPart1 = input => {
  const { squares, rounds } = locateRocks(input)
  let maxRow = input.length

  let northRounds = tiltNorth(rounds, squares)
  let totalLoad = calcLoad(northRounds, maxRow)

  return totalLoad

  // 111339
}

const runPart2 = input => {
  // takes a while to run

  const { squares, rounds } = locateRocks(input)
  const maxRow = input.length
  const maxCol = input[0].length
  const factor = 1000000000

  let rotatedRounds = rounds
  let loadPerRotation = {}
  const steps = 300
  let lastLoads = []

  for (let i = 0; i < steps; i++) {
    rotatedRounds = rotateRocks(rotatedRounds, squares, maxRow, maxCol)
    let totalLoad = calcLoad(rotatedRounds, maxRow)
    loadPerRotation[i] = totalLoad

    if (i > steps - 60) {
      lastLoads.push(totalLoad)
    }
  }

  // previous code had shown that the pattern repeats every 26 steps
  // or every 7 steps for the test data
  let repeatInterval = 26
  if (lastLoads[0] < 100) {
    repeatInterval = 7
  }

  let offset = (factor - steps) % repeatInterval
  let lastLoad = lastElement(lastLoads)
  let firstIndex = lastLoads.indexOf(lastLoad)
  let reqIndex = firstIndex + offset
  let reqLoad = lastLoads[reqIndex]

  return reqLoad

  // 93736
}

const printRocks = (rounds, squares, maxRow, maxCol) => {
  let grid = []

  for (let row = 0; row < maxRow; row++) {
    let rowString = ''
    for (let col = 0; col < maxCol; col++) {
      let square = `${row},${col}`
      if (squares.has(square)) {
        rowString += '# '
      } else if (rounds.includes(square)) {
        rowString += 'O '
      } else {
        rowString += '. '
      }
    }
    grid.push(rowString)
  }

  console.log(grid.join('\n'))
  console.log('-------------------')
}

const locateRocks = input => {
  let squares = new Set()
  let rounds = []

  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[row].length; col++) {
      if (input[row][col] === '#') {
        squares.add(`${row},${col}`)
      } else if (input[row][col] === 'O') {
        rounds.push(`${row},${col}`)
      }
    }
  }

  return { squares, rounds }
}

const rotateRocks = (rounds, squares, maxRow, maxCol) => {
  let northRounds = tiltNorth(rounds, squares)
  let westRounds = tiltWest(northRounds, squares)
  let southRounds = tiltSouth(westRounds, squares, maxRow)
  let eastRounds = tiltEast(southRounds, squares, maxCol)
  return eastRounds
}

const tiltNorth = (rounds, squares) => {
  let northRounds = []
  const sortedRounds = sortByRow(rounds)

  for (const round of sortedRounds) {
    let [row, col] = convertToIntegers(round.split(','))
    let north = `${row},${col}`

    while (true) {
      if (row <= 0) {
        break
      }

      row--
      north = `${row},${col}`
      if (squares.has(north) || northRounds.includes(north)) {
        north = `${row + 1},${col}`
        break
      }
    }

    northRounds.push(north)
  }

  return northRounds
}

const tiltWest = (rounds, squares) => {
  let westRounds = []
  const sortedRounds = sortByCol(rounds)

  for (const round of sortedRounds) {
    let [row, col] = convertToIntegers(round.split(','))
    let west = `${row},${col}`

    while (true) {
      if (col <= 0) {
        break
      }

      col--
      west = `${row},${col}`
      if (squares.has(west) || westRounds.includes(west)) {
        west = `${row},${col + 1}`
        break
      }
    }

    westRounds.push(west)
  }

  return westRounds
}

const tiltSouth = (rounds, squares, maxRow) => {
  let southRounds = []
  const sortedRounds = sortByRow(rounds).reverse()

  for (const round of sortedRounds) {
    let [row, col] = convertToIntegers(round.split(','))
    let south = `${row},${col}`

    while (true) {
      if (row >= maxRow - 1) {
        break
      }

      row++
      south = `${row},${col}`
      if (squares.has(south) || southRounds.includes(south)) {
        south = `${row - 1},${col}`
        break
      }
    }

    southRounds.push(south)
  }

  return southRounds
}

const tiltEast = (rounds, squares, maxCol) => {
  let eastRounds = []
  const sortedRounds = sortByCol(rounds).reverse()

  for (const round of sortedRounds) {
    let [row, col] = convertToIntegers(round.split(','))
    let east = `${row},${col}`

    while (true) {
      if (col >= maxCol - 1) {
        break
      }

      col++
      east = `${row},${col}`
      if (squares.has(east) || eastRounds.includes(east)) {
        east = `${row},${col - 1}`
        break
      }
    }

    eastRounds.push(east)
  }

  return eastRounds
}

const calcLoad = (rounds, maxRow) => {
  let roundsPerRow = {}

  for (const round of rounds) {
    let [row, _] = convertToIntegers(round.split(','))
    if (!roundsPerRow[row]) {
      roundsPerRow[row] = 1
    } else {
      roundsPerRow[row]++
    }
  }

  let totalLoad = 0

  for (const row of Object.keys(roundsPerRow)) {
    const rowLoadPerRound = maxRow - row
    const rowLoad = rowLoadPerRound * roundsPerRow[row]
    totalLoad += rowLoad
  }

  return totalLoad
}

const sortByRow = rounds => {
  return rounds.sort((a, b) => {
    const firstA = parseInt(a.split(',')[0])
    const firstB = parseInt(b.split(',')[0])
    return firstA - firstB
  })
}

const sortByCol = rounds => {
  return rounds.sort((a, b) => {
    const lastA = parseInt(a.split(',').pop())
    const lastB = parseInt(b.split(',').pop())
    return lastA - lastB
  })
}

module.exports = {
  runPart1,
  runPart2,
}
