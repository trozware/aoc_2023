const { convertToIntegers } = require('../utils')

const runPart1 = input => {
  let row = 0
  let col = 0
  let grid = {}

  let gridStartRow = 100000000000000
  let gridEndRow = 0
  let gridStartCol = 100000000000000
  let gridEndCol = 0

  const [direction, length, color] = input[0].split(' ')
  const hexCode = color.slice(2, 8)
  const start = `${row},${col}`
  grid[start] = hexCode

  for (const line of input) {
    const [direction, length, color] = line.split(' ')
    const distance = parseInt(length)
    const hexCode = color.slice(2, 8)

    for (let i = 0; i < distance; i++) {
      switch (direction) {
        case 'U':
          row--
          break
        case 'D':
          row++
          break
        case 'L':
          col--
          break
        case 'R':
          col++
          break
      }

      const coord = `${row},${col}`
      grid[coord] = hexCode

      if (row > gridEndRow) gridEndRow = row
      if (row < gridStartRow) gridStartRow = row
      if (col > gridEndCol) gridEndCol = col
      if (col < gridStartCol) gridStartCol = col
    }
  }

  console.log(gridStartRow, gridStartCol, gridEndRow, gridEndCol)

  let gridString = printGrid(
    grid,
    gridStartRow,
    gridEndRow,
    gridStartCol,
    gridEndCol
  )

  let fillCounter = Object.keys(grid).length
  let gridLines = gridString.split('\n')
  let newGridLines = []

  for (let gridLine of gridLines) {
    // console.log(gridLine)
    // const regex = /#+(\.+)#+/gm
    // while ((match = regex.exec(gridLine))) {
    //   console.log(match.index + ' ' + regex.lastIndex)
    // }

    // REGEX not working because ###.### returns an index of 0 instead of 3
    while (true) {
      const regex = /#+(\.+)#+/gm
      const matches = regex.exec(gridLine)
      if (!matches) break
      console.log(matches)
      break
    }

    // const match = gridLine.match(regex)
    // if (!match) break
    // console.log(match)
    // break
    // for (const match of matches) {
    //   console.log(match)
    //   const matchLength = match[1].length
    //   fillCounter += matchLength
    //   const matchStart = match.index + 1

    //   const fillString = '#'.repeat(matchLength)
    //   // replace the match with the fill string
    //   const before = gridLine.substring(0, matchStart)
    //   const after = gridLine.substring(matchStart + matchLength)
    //   gridLine = before + fillString + after
    // }
    // }
    // console.log(gridLine)
    newGridLines.push(gridLine)
  }

  console.log(newGridLines.join('\n'))
  console.log(fillCounter)

  const totalChars = gridString.length
  const charsWithoutFill = gridString.replace(/#/g, '').length
  console.log(totalChars, charsWithoutFill, totalChars - charsWithoutFill)

  // console.log(Object.keys(grid).length)

  // grid = fillGrid(grid, gridStartRow, gridEndRow, gridStartCol, gridEndCol)
  // printGrid(grid, gridStartRow, gridEndRow, gridStartCol, gridEndCol)
  // console.log(Object.keys(grid).length)

  // return Object.keys(grid).length

  // 27498 too low - not allowing for negative coords
  // 42168 too high - not stopping fill at edge
  // 33725 - too low ?? probably regex error
}

const runPart2 = input => {}

const fillGrid = (grid, startRow, endRow, startCol, endCol) => {
  let newGrid = grid
  let betweenEdges = false
  let lastEdge = -2
  let edgeNodes = new Set(Object.keys(grid))

  for (let row = startRow; row <= endRow; row++) {
    betweenEdges = false
    lastEdge = -2
    for (let col = startCol; col <= endCol; col++) {
      const coord = `${row},${col}`
      if (edgeNodes.has(coord)) {
        if (col > lastEdge + 1) {
          betweenEdges = !betweenEdges
        }
        lastEdge = col
      } else {
        if (betweenEdges) {
          newGrid[coord] = '#'
        }
      }
    }
  }

  return newGrid
}

const printGrid = (grid, startRow, endRow, startCol, endCol) => {
  let nodes = new Set(Object.keys(grid))

  let gridStr = ''
  for (let row = startRow; row <= endRow; row++) {
    let rowStr = ''
    for (let col = startCol; col <= endCol; col++) {
      const coord = `${row},${col}`
      if (nodes.has(coord)) {
        rowStr += '#'
      } else {
        rowStr += '.'
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
