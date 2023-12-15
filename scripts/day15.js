const { sumArray } = require('../utils')

const runPart1 = input => {
  const sequences = input
    .join('')
    .split(',')
    .map(s => runHash(s))

  const result = sumArray(sequences)
  return result

  // 512283
}

const runPart2 = input => {
  const sequences = input.join('').split(',')

  let boxes = {}

  for (const sequence of sequences) {
    let lastChar = sequence.charAt(sequence.length - 1)
    if (lastChar === '-') {
      const label = sequence.slice(0, -1)
      const box = runHash(label)
      boxes = removeLens(boxes, box, label)
    } else {
      const [label, focalLength] = sequence.split('=')
      const box = runHash(label)
      boxes = addLens(boxes, box, label, parseInt(focalLength))
    }
  }

  const result = calcPower(boxes)
  return result

  // 215827
}

const runHash = string => {
  let num = 0
  const chars = string.split('')

  for (const char of chars) {
    const ascii = char.charCodeAt(0)
    num += ascii
    num = num * 17
    num = num % 256
  }

  return num
}

const removeLens = (boxes, box, label) => {
  if (boxes[box]) {
    const labelsInBox = Object.keys(boxes[box])
    for (const labelInBox of labelsInBox) {
      if (labelInBox === label) {
        delete boxes[box][labelInBox]
      }
    }
  }

  return boxes
}

const addLens = (boxes, box, label, focalLength) => {
  let doneReplace = false

  if (boxes[box]) {
    const labelsInBox = Object.keys(boxes[box])
    for (const labelInBox of labelsInBox) {
      if (labelInBox === label) {
        boxes[box][labelInBox] = focalLength
        doneReplace = true
      }
    }
  }

  if (!doneReplace) {
    if (!boxes[box]) {
      boxes[box] = []
    }
    boxes[box][label] = focalLength
  }

  return boxes
}

const calcPower = boxes => {
  let total = 0

  for (const box of Object.keys(boxes)) {
    const boxNum = parseInt(box)
    const lenses = Object.keys(boxes[box])
    if (lenses.length === 0) {
      continue
    }

    for (let index = 0; index < lenses.length; index++) {
      const focalLength = boxes[box][lenses[index]]
      const lensPower = (boxNum + 1) * (index + 1) * focalLength
      total += lensPower
    }
  }

  return total
}

module.exports = {
  runPart1,
  runPart2,
}
