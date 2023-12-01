const runPart1 = input => {
  let numbers = []

  for (const line of input) {
    const calibration = getNumberFromLine(line)
    numbers.push(parseInt(calibration))
  }

  const total = numbers.reduce((acc, curr) => acc + curr, 0)
  return total
}

const runPart2 = input => {
  let numbers = []

  for (const line of input) {
    const newLine = convertWordsToDigits(line)
    const calibration = getNumberFromLine(newLine)
    numbers.push(parseInt(calibration))
  }

  const total = numbers.reduce((acc, curr) => acc + curr, 0)
  return total
}

const getNumberFromLine = line => {
  let digits = []

  for (const char of line) {
    const num = parseInt(char)
    if (!isNaN(num)) {
      digits.push(char)
    }
  }

  const number = digits[0] + digits[digits.length - 1]
  return number
}

const convertWordsToDigits = line => {
  let newLine = ''

  // check numbers in order of word length, then value
  const numbers = {
    three: '3',
    eight: '8',
    seven: '7',
    nine: '9',
    four: '4',
    five: '5',
    six: '6',
    two: '2',
    one: '1',
  }

  let index = 0
  let foundDigit = false

  while (index < line.length) {
    for (const num of Object.keys(numbers)) {
      const testWord = line.substr(index, num.length)
      if (testWord === num) {
        newLine += numbers[num]
        index += num.length - 1
        foundDigit = true
        break
      }
    }
    if (!foundDigit) {
      newLine += line[index]
      index += 1
    }
    foundDigit = false
  }

  return newLine
}

module.exports = {
  runPart1,
  runPart2,
}
