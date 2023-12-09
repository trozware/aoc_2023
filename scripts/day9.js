const { convertToIntegers, lastElement } = require('../utils')

const runPart1 = input => {
  let total = 0

  for (const line of input) {
    const newValue = extrapolate(line)
    total += newValue
  }

  console.log('Total =', total)
  return total

  // 2038472161
}

const runPart2 = input => {
  let total = 0

  for (const line of input) {
    const newValue = extrapolateBack(line)
    total += newValue
  }

  console.log('Total =', total)
  return total
}

const extrapolate = line => {
  let processedLines = fillOutArray(line)

  for (let i = processedLines.length - 1; i > 0; i--) {
    const newEnd =
      lastElement(processedLines[i]) + lastElement(processedLines[i - 1])
    processedLines[i - 1].push(newEnd)
  }

  const nextValue = lastElement(processedLines[0])
  return nextValue

  // 1091
}

const extrapolateBack = line => {
  let processedLines = fillOutArray(line)

  for (let i = processedLines.length - 1; i > 0; i--) {
    const newStart = processedLines[i - 1][0] - processedLines[i][0]
    processedLines[i - 1].unshift(newStart)
  }

  const nextValue = processedLines[0][0]
  return nextValue
}

const fillOutArray = line => {
  let activeLine = convertToIntegers(line.split(' '))
  let processedLines = [activeLine]

  while (true) {
    let newLine = []
    for (let i = 1; i < activeLine.length; i++) {
      newLine.push(activeLine[i] - activeLine[i - 1])
    }

    const zeroCount = newLine.filter(x => x === 0).length
    if (zeroCount == newLine.length) {
      newLine.push(0)
      processedLines.push(newLine)
      break
    }
    processedLines.push(newLine)
    activeLine = newLine
  }

  return processedLines
}

module.exports = {
  runPart1,
  runPart2,
}
