const { convertToIntegers, sumArray } = require('../utils')

const runPart1 = input => {
  let totalScore = 0

  for (const line of input) {
    const [_, game] = line.split(': ')
    const matches = matchesForGame(game)

    if (matches > 0) {
      totalScore += Math.pow(2, matches - 1)
    }
  }

  return totalScore

  // 23941
}

const runPart2 = input => {
  let gameScores = []
  let cardCounts = []

  for (const line of input) {
    const [_, game] = line.split(': ')
    const matches = matchesForGame(game)

    gameScores.push(matches)
    cardCounts.push(1)
  }

  for (let i = 0; i < gameScores.length; i++) {
    const count = cardCounts[i]
    let newCards = gameScores[i]

    for (let j = i + 1; j <= i + newCards; j++) {
      cardCounts[j] += count
    }
  }

  const totalCards = sumArray(cardCounts)
  return totalCards

  // 5571760
}

const matchesForGame = game => {
  let [winners, yours] = game.split(' | ')
  winners = winners.replaceAll('  ', ' ').trim()
  yours = yours.replaceAll('  ', ' ').trim()

  const winningNumbers = new Set(convertToIntegers(winners.split(' ')))
  const yourNumbers = new Set(convertToIntegers(yours.split(' ')))

  let matches = 0

  for (const number of yourNumbers) {
    if (winningNumbers.has(number)) {
      matches += 1
    }
  }

  return matches
}

module.exports = {
  runPart1,
  runPart2,
}
