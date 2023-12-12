const runPart1 = input => {
  let grid = addRows(input)
  grid = addCols(grid)

  const galaxies = locateGalaxies(grid)
  const galaxyIDs = galaxies.map(g => g.id)
  const combinations = getCombinations(galaxyIDs)

  let totalDistance = 0

  for (const idPair of combinations) {
    const distance = distanceBetween(idPair, galaxies)
    totalDistance += distance
  }

  return totalDistance

  // 9556712
}

const runPart2 = input => {
  const galaxies = locateGalaxies(input)
  const galaxyIDs = galaxies.map(g => g.id)
  const combinations = getCombinations(galaxyIDs)

  const emptyRows = listEmptyRows(input)
  const emptyCols = listEmptyCols(input)

  let storedDistances = {}

  for (const idPair of combinations) {
    const distance = distanceBetween(idPair, galaxies)
    storedDistances[idPair] = distance
  }

  let totalDistance = 0
  const adder = 1000000 - 1

  for (const idPair of combinations) {
    let distance = storedDistances[idPair]

    const [start, end] = idPair.split(',')
    const startGalaxy = galaxies.find(g => g.id === parseInt(start))
    const endGalaxy = galaxies.find(g => g.id === parseInt(end))
    const lowestRow = Math.min(startGalaxy.r, endGalaxy.r)
    const highestRow = Math.max(startGalaxy.r, endGalaxy.r)
    const lowestCol = Math.min(startGalaxy.c, endGalaxy.c)
    const highestCol = Math.max(startGalaxy.c, endGalaxy.c)

    const rowsToInsert = emptyRows.filter(
      r => r > lowestRow && r < highestRow,
    ).length
    const colsToInsert = emptyCols.filter(
      c => c > lowestCol && c < highestCol,
    ).length

    for (let i = 0; i < rowsToInsert; i++) {
      distance += adder
    }
    for (let i = 0; i < colsToInsert; i++) {
      distance += adder
    }

    totalDistance += distance
  }

  return totalDistance

  // 678626199476
}

const addRows = grid => {
  const newGrid = []
  for (const line of grid) {
    let numGalaxies = line.split('').filter(c => c === '#').length
    if (numGalaxies > 0) {
      newGrid.push(line)
    } else {
      newGrid.push(line)
      newGrid.push(line)
    }
  }
  return newGrid
}

const addCols = grid => {
  const emptyCols = []
  const numCols = grid[0].length

  for (let c = 0; c < numCols; c++) {
    let numGalaxies = 0
    for (const line of grid) {
      if (line[c] === '#') {
        numGalaxies++
      }
    }
    if (numGalaxies === 0) {
      emptyCols.unshift(c)
    }
  }

  const newGrid = grid.map(line => {
    const newLine = line.split('')
    for (const c of emptyCols) {
      newLine.splice(c, 0, '.')
    }
    return newLine.join('')
  })

  return newGrid
}

const listEmptyRows = grid => {
  const emptyRows = []
  for (let r = 0; r < grid.length; r++) {
    const line = grid[r]
    if (line.indexOf('#') === -1) {
      emptyRows.push(r)
    }
  }
  return emptyRows
}

const listEmptyCols = grid => {
  const emptyCols = []
  const numCols = grid[0].length

  for (let c = 0; c < numCols; c++) {
    let numGalaxies = 0
    for (const line of grid) {
      if (line[c] === '#') {
        numGalaxies++
        break
      }
    }
    if (numGalaxies === 0) {
      emptyCols.push(c)
    }
  }
  return emptyCols
}

const locateGalaxies = grid => {
  const galaxies = []
  let id = 1

  for (let r = 0; r < grid.length; r++) {
    const line = grid[r]
    for (let c = 0; c < line.length; c++) {
      if (line[c] === '#') {
        galaxies.push({ id, r, c })
        id++
      }
    }
  }
  return galaxies
}

const getCombinations = ids => {
  let results = []
  for (let i = 0; i < ids.length - 1; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      results.push(`${ids[i]},${ids[j]}`)
    }
  }
  return results
}

const distanceBetween = (idPair, galaxies) => {
  const [start, end] = idPair.split(',')
  const startGalaxy = galaxies.find(g => g.id === parseInt(start))
  const endGalaxy = galaxies.find(g => g.id === parseInt(end))
  const distance =
    Math.abs(startGalaxy.r - endGalaxy.r) +
    Math.abs(startGalaxy.c - endGalaxy.c)
  return distance
}

module.exports = {
  runPart1,
  runPart2,
}
