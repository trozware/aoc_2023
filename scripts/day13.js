const { lastElement } = require('../utils')

const runPart1 = input => {
  const patterns = input.join('\n').split('\n\n')

  let lefts = 0
  let aboves = 0

  for (const pattern of patterns) {
    let patternUp = lookForHorizontalMirror(pattern)
    if (patternUp) {
      aboves += patternUp
    }
    let patternLeft = lookForVerticalMirror(pattern)
    if (patternLeft) {
      lefts += patternLeft
    }
  }

  const result = aboves * 100 + lefts
  return result

  // 27664
}

const runPart2 = input => {
  const patterns = input.join('\n').split('\n\n')

  let lefts = 0
  let aboves = 0

  for (const pattern of patterns) {
    let patternLeft = lookForVerticalMirrorWithSmudge(pattern)
    if (patternLeft) {
      lefts += patternLeft
    }
    let patternUp = lookForHorizontalMirrorWithSmudge(pattern)
    if (patternUp) {
      aboves += patternUp
    }
  }

  const result = aboves * 100 + lefts
  return result

  // 33991
}

const lookForHorizontalMirror = pattern => {
  // compare line 1 to 2
  // compare line 1 + 2 to 3 + 4
  // compare line 1 + 2 + 3 to 4 + 5 + 6
  // compare line 2 + 3 + 4 to 5 + 6 + 7
  // compare line 4 + 5 to 6 + 7
  // compare line 6 to 7

  const rows = pattern.split('\n')
  let groupings = generateGroupings(rows.length)

  for (const grouping of groupings) {
    const upperGroup = grouping[0]
    const lowerGroup = grouping[1]

    const upperLines = rows.slice(upperGroup[0], lastElement(upperGroup) + 1)
    const lowerLines = rows.slice(lowerGroup[0], lastElement(lowerGroup) + 1)

    const upperString = upperLines.reverse().join('')
    const lowerString = lowerLines.join('')

    if (upperString === lowerString) {
      return lastElement(grouping[0]) + 1
    }
  }

  return undefined
}

const lookForHorizontalMirrorWithSmudge = pattern => {
  // compare the same groupings as above
  // if the combined strings differ by only 1 character, you've found the smudge & have a valid mirror

  const rows = pattern.split('\n')
  let groupings = generateGroupings(rows.length)

  for (const grouping of groupings) {
    const upperGroup = grouping[0]
    const lowerGroup = grouping[1]

    const upperLines = rows.slice(upperGroup[0], lastElement(upperGroup) + 1)
    const lowerLines = rows.slice(lowerGroup[0], lastElement(lowerGroup) + 1)

    const upperString = upperLines.reverse().join('')
    const lowerString = lowerLines.join('')

    if (hasOnlyOneDiff(upperString, lowerString)) {
      return lastElement(grouping[0]) + 1
    }
  }

  return undefined
}

const generateGroupings = maxLength => {
  // generate all the possible comparisons:
  // row 0 & 1, 0 + 1 & 2 + 3, 0 + 1 + 2 & 3 + 4 + 5, etc.

  let groupings = []
  let start = 0
  let arrayLen = 1

  while (true) {
    let group1 = []
    for (let i = start; i < start + arrayLen; i++) {
      group1.push(i)
    }
    let group2 = []
    for (let i = start + arrayLen; i < start + arrayLen + group1.length; i++) {
      group2.push(i)
    }

    if (
      (group1.includes(0) || group2.includes(maxLength - 1)) &&
      !group2.includes(maxLength)
    ) {
      groupings.push([group1, group2])
    }

    if (lastElement(group2) < maxLength - 1) {
      arrayLen++
    } else {
      start += 1
      arrayLen -= 1
    }

    if (group2.length === 1 && lastElement(group2) === maxLength - 1) {
      break
    }
  }

  return groupings
}

const lookForVerticalMirror = pattern => {
  let rotatedPattern = rotatePattern(pattern)

  const mirror = lookForHorizontalMirror(rotatedPattern)
  return mirror
}

const lookForVerticalMirrorWithSmudge = pattern => {
  let rotatedPattern = rotatePattern(pattern)

  const mirror = lookForHorizontalMirrorWithSmudge(rotatedPattern)
  return mirror
}

const rotatePattern = pattern => {
  let cols = []
  const rows = pattern.split('\n')
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < rows[r].length; c++) {
      if (!cols[c]) {
        cols[c] = []
      }
      cols[c][r] = rows[r][c]
    }
  }

  let rotatedPattern = []
  for (const c of cols) {
    rotatedPattern.push(c.join(''))
  }
  return rotatedPattern.join('\n')
}

const hasOnlyOneDiff = (line1, line2) => {
  let diff = 0
  for (let i = 0; i < line1.length; i++) {
    if (line1[i] !== line2[i]) {
      diff++
    }
  }
  return diff === 1
}

module.exports = {
  runPart1,
  runPart2,
}
