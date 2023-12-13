const { convertToIntegers, sumArray, combinations } = require('../utils')

const runPart1 = input => {
  // brute force solution, takes nearly 7 seconds but at least it works
  let allSolutions = []

  for (const line of input) {
    const solutions = findSolutionsForLine(line)
    allSolutions.push(solutions)
  }

  const sum = sumArray(allSolutions)
  return sum

  // 7843
}

const runPart2 = input => {
  // unfolding is correct but runs out of memory on the 2nd line of the test data

  let allSolutions = []

  for (const line of input) {
    const unfolded = unfoldLine(line)
    // const solutions = findSolutionsForLine(unfolded)
    // allSolutions.push(solutions)
  }

  console.log('allSolutions', allSolutions)
  const sum = sumArray(allSolutions)
  return sum
}

const unfoldLine = line => {
  const [springs, records] = line.split(' ')

  let unfoldedSprings = springs
  let unfoldedRecords = records

  for (let i = 1; i < 5; i++) {
    unfoldedSprings += '?' + springs
    unfoldedRecords += ',' + records
  }

  return unfoldedSprings + ' ' + unfoldedRecords
}

const findSolutionsForLine = line => {
  const { springs, groups, recordNums } = parseLine(line)
  const valid = isValid(groups, recordNums)

  const nums = findQuestionMarks(line)
  const combs = combinations(nums)

  let testLine = springs.replaceAll('?', '.')

  let solutions = 0
  for (const comb of combs) {
    const valid = testCombination(testLine, comb, recordNums)
    if (valid) {
      solutions++
    }
  }

  return solutions
}

const parseLine = line => {
  const [springs, records] = line.split(' ')
  const recordNums = convertToIntegers(records.split(','))
  const groups = splitSpringsIntoGroups(springs)

  return { springs, groups, recordNums }
}

const isValid = (groups, recordLengths) => {
  if (groups.length < recordLengths.length) {
    return false
  }

  for (let i = 0; i < groups.length; i++) {
    if (groups[i].length !== recordLengths[i]) {
      return false
    }
  }

  return true
}

const findQuestionMarks = line => {
  const questionMarks = []
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '?') {
      questionMarks.push(i)
    }
  }
  return questionMarks
}

const testCombination = (line, combination, recordNums) => {
  let testLine = line
  for (let i = 0; i < combination.length; i++) {
    testLine = replaceAt(testLine, combination[i], '#')
  }
  const groups = splitSpringsIntoGroups(testLine)
  const valid = isValid(groups, recordNums)

  return valid
}

const splitSpringsIntoGroups = springs => {
  const groups = springs
    .split('.')
    .map(group => {
      const trimmed = group.replace(/^\.+|\.+$/g, '')
      return trimmed
    })
    .filter(group => group.length > 0)
  return groups
}

const replaceAt = (string, index, replacement) => {
  return (
    string.substr(0, index) +
    replacement +
    string.substr(index + replacement.length)
  )
}

module.exports = {
  runPart1,
  runPart2,
}

// 2 to the power of (total slots - required slots)
