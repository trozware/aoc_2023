const { isDigit } = require('../utils')

const runPart1 = input => {
  const { numbers, symbols } = parseNumbersSymbols(input, false)

  let total = 0

  for (const number of numbers) {
    const { nextTo, _ } = isNextToSymbol(number, symbols)
    if (nextTo) {
      total += parseInt(number.num)
    }
  }

  return total

  // 519861 is wrong
  // 447605 is too low
  // 520019 was correct
}

const runPart2 = input => {
  const { numbers, symbols } = parseNumbersSymbols(input, true)

  let nextToGears = {}

  for (const number of numbers) {
    const { nextTo, symbol } = isNextToSymbol(number, symbols)
    if (nextTo) {
      if (!nextToGears[symbol]) {
        nextToGears[symbol] = [parseInt(number.num)]
      } else {
        nextToGears[symbol].push(parseInt(number.num))
      }
    }
  }

  let total = 0

  for (const symbol of Object.keys(nextToGears)) {
    if (nextToGears[symbol].length === 2) {
      const ratio = nextToGears[symbol][0] * nextToGears[symbol][1]
      total += ratio
    }
  }

  // 75519888

  return total
}

const parseNumbersSymbols = (input, starOnly) => {
  let numbers = []
  let symbols = new Set()

  let insideNumber = false
  let row = 0
  let col = 0

  for (const line of input) {
    let newNumber = {}
    insideNumber = false

    for (const char of line) {
      if (isDigit(char)) {
        if (!insideNumber) {
          insideNumber = true
          newNumber = { row, col, num: char }
        } else {
          newNumber.num += char
        }
      } else {
        if (newNumber.num) {
          numbers.push(newNumber)
        }
        newNumber = {}
        insideNumber = false

        if (starOnly && char === '*') {
          symbols.add(`${row} ${col}`)
        } else if (!starOnly && char !== '.') {
          symbols.add(`${row} ${col}`)
        }
      }

      col += 1
    }

    // allow for reaching the end of a line while inside a number
    if (newNumber.num) {
      numbers.push(newNumber)
    }

    row += 1
    col = 0
  }

  return { numbers, symbols }
}

const isNextToSymbol = (num, symbols) => {
  const startRow = num.row - 1
  const endRow = num.row + 1
  const startCol = num.col - 1
  const endCol = startCol + num.num.length + 1

  for (row = startRow; row <= endRow; row += 1) {
    for (col = startCol; col <= endCol; col += 1) {
      if (symbols.has(`${row} ${col}`)) {
        return { nextTo: true, symbol: `${row} ${col}` }
      }
    }
  }

  return { nextTo: false, symbol: null }
}

module.exports = {
  runPart1,
  runPart2,
}
