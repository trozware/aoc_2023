const { convertToIntegers } = require('../utils')

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
  // Change basic checks
  // compare line 1 & 2
  // compare line 1 + 2 to 3 + 4
  // compare line 1 + 2 + 3 to 4 + 5 + 6
  // then if the combined strings differ by only 1, you've found the smudge
}

const lookForHorizontalMirror = (pattern, direction = 'H') => {
  // find two lines that are the same
  // the expand out in both directions and check for matches until one side reaches the end

  const rows = pattern.split('\n')
  for (let r = 1; r < rows.length; r++) {
    if (rows[r] === rows[r - 1]) {
      let up = r - 1
      let down = r
      let match = true

      while (match) {
        up--
        down++

        if (up < 0 || down >= rows.length) {
          break
        }

        const upperLine = rows[up]
        const lowerLine = rows[down]
        if (upperLine !== lowerLine) {
          match = false
        }
      }

      if (match) {
        return r
      }
    }
  }

  return undefined
}

const lookForVerticalMirror = pattern => {
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

  const mirror = lookForHorizontalMirror(rotatedPattern.join('\n'), 'V')
  return mirror
}

module.exports = {
  runPart1,
  runPart2,
}
