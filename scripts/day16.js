const { convertToIntegers } = require('../utils')

const runPart1 = input => {
  let cave = parseCave(input)
  const caveHeight = input.length
  const caveWidth = input[0].length

  let result = processCave(cave, 0, 0, 'right', caveHeight, caveWidth)
  return result

  // 7562
}

const runPart2 = input => {
  // slow but effective - takes about 30 seconds to run

  let cave = parseCave(input)
  const caveHeight = input.length
  const caveWidth = input[0].length

  let possibleStarts = []
  for (let col = 0; col < caveWidth; col++) {
    possibleStarts.push({ row: 0, col, direction: 'down' })
    possibleStarts.push({ row: caveHeight - 1, col, direction: 'up' })
  }
  for (let row = 0; row < caveHeight; row++) {
    possibleStarts.push({ row, col: 0, direction: 'right' })
    possibleStarts.push({ row, col: caveWidth - 1, direction: 'left' })
  }

  let maxResult = 0
  let originalCave = JSON.stringify(cave)
  const numStarts = possibleStarts.length
  let counter = 0

  for (const start of possibleStarts) {
    let clonedCave = JSON.parse(originalCave)
    const result = processCave(
      clonedCave,
      start.row,
      start.col,
      start.direction,
      caveHeight,
      caveWidth,
    )
    if (result > maxResult) {
      maxResult = result
    }
    // console.log(start, result)
    counter++
    if (counter % 40 === 0) {
      console.log(`${counter} of ${numStarts}`)
    }
  }

  return maxResult

  // 7793
}

const parseCave = input => {
  let cave = []
  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[row].length; col++) {
      const loc = { row, col, symbol: input[row][col], energised: false }
      cave.push(loc)
    }
  }

  return cave
}

const processCave = (
  cave,
  startRow,
  startCol,
  startDirection,
  caveHeight,
  caveWidth,
) => {
  let beams = [{ row: startRow, col: startCol, direction: startDirection }]
  let processed = new Set()

  const mirrors = ['/', '\\']
  const splitters = ['|', '-']

  // printCave(cave)

  while (beams.length > 0) {
    const caveLoc = cave.findIndex(
      loc => loc.row === beams[0].row && loc.col === beams[0].col,
    )
    cave[caveLoc].energised = true
    const caveSymbol = cave[caveLoc].symbol

    // need to record each loc/direction processed and avoid processing again
    const beamID = `${beams[0].row},${beams[0].col},${beams[0].direction}`
    if (processed.has(beamID)) {
      beams.shift()
      continue
    }
    processed.add(beamID)

    if (mirrors.includes(caveSymbol)) {
      beams[0].direction = applyMirror(caveSymbol, beams[0].direction)
    } else if (splitters.includes(caveSymbol)) {
      if (
        caveSymbol === '|' &&
        (beams[0].direction === 'right' || beams[0].direction === 'left')
      ) {
        beams[0].direction = 'down'

        const newBeam = {
          row: beams[0].row - 1,
          col: beams[0].col,
          direction: 'up',
        }
        if (isValidBeam(newBeam, caveWidth, caveHeight)) {
          beams.push(newBeam)
        }
      }

      if (
        caveSymbol === '-' &&
        (beams[0].direction === 'up' || beams[0].direction === 'down')
      ) {
        beams[0].direction = 'right'
        const newBeam = {
          row: beams[0].row,
          col: beams[0].col - 1,
          direction: 'left',
        }
        if (isValidBeam(newBeam, caveWidth, caveHeight)) {
          beams.push(newBeam)
        }
      }
    }

    const newLoc = calcNewLoc(beams[0], caveWidth, caveHeight)
    if (newLoc === undefined) {
      beams.shift()
      continue
    }
    beams[0].row = newLoc.row
    beams[0].col = newLoc.col

    const newCaveLoc = cave.findIndex(
      loc => loc.row === newLoc.row && loc.col === newLoc.col,
    )
    cave[newCaveLoc].energised = true
  }

  // printCave(cave)

  const energisedLocs = cave.filter(loc => loc.energised)
  return energisedLocs.length
}

const printCave = cave => {
  let caveString = ''
  for (const caveLoc of cave) {
    if (caveLoc.col === 0) {
      console.log(caveString)
      caveString = ''
    }

    if (caveLoc.energised) {
      caveString += '#'
    } else {
      caveString += caveLoc.symbol
    }
  }
  console.log(caveString)
  console.log('-------------------------')
}

const calcNewLoc = (beam, caveWidth, caveHeight) => {
  let newBeamLoc = undefined
  if (beam.direction === 'right') {
    newBeamLoc = { row: beam.row, col: beam.col + 1 }
  } else if (beam.direction === 'down') {
    newBeamLoc = { row: beam.row + 1, col: beam.col }
  } else if (beam.direction === 'left') {
    newBeamLoc = { row: beam.row, col: beam.col - 1 }
  } else if (beam.direction === 'up') {
    newBeamLoc = { row: beam.row - 1, col: beam.col }
  }

  if (newBeamLoc.row < 0 || newBeamLoc.row >= caveHeight) {
    return undefined
  }
  if (newBeamLoc.col < 0 || newBeamLoc.col >= caveWidth) {
    return undefined
  }
  return newBeamLoc
}

const applyMirror = (mirror, direction) => {
  if (mirror === '/') {
    if (direction === 'right') {
      return 'up'
    } else if (direction === 'down') {
      return 'left'
    } else if (direction === 'left') {
      return 'down'
    } else if (direction === 'up') {
      return 'right'
    }
  } else if (mirror === '\\') {
    if (direction === 'right') {
      return 'down'
    } else if (direction === 'down') {
      return 'right'
    } else if (direction === 'left') {
      return 'up'
    } else if (direction === 'up') {
      return 'left'
    }
  }
}

const isValidBeam = (beam, caveWidth, caveHeight) => {
  if (beam.row < 0 || beam.row >= caveHeight) {
    return false
  }
  if (beam.col < 0 || beam.col >= caveWidth) {
    return false
  }
  return true
}

module.exports = {
  runPart1,
  runPart2,
}
