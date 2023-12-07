const runPart1 = input => {
  let games = []
  for (const line of input) {
    const [hand, bid] = line.split(' ')
    const result = scoreForHand(hand)
    games.push({ hand, bid, result, alpha: handAsAlpha(hand), decider: 0 })
  }

  let total = totalScore(games)
  return total

  // 250232501
}

const runPart2 = input => {
  let games = []

  for (const line of input) {
    const [hand, bid] = line.split(' ')
    const { bestScore, bestHand } = scoreForHand2(hand)
    games.push({
      hand,
      bid,
      result: bestScore,
      jokers: bestHand,
      alpha: handAsAlpha2(hand),
      decider: 0,
    })
  }

  let total = totalScore(games)
  return total

  // 249138943
}

const scoreForHand = cards => {
  // 7: five of a kind
  // 6: four of a kind
  // 5: full house - 3 of a kind plus 2 of a kind
  // 4: three of a kind
  // 3: two pair
  // 2: one pair
  // 1: high card

  const cardValues = cards.split('')
  const cardCounts = {}
  for (const card of cardValues) {
    cardCounts[card] = cardCounts[card] ? cardCounts[card] + 1 : 1
  }

  const numberOfDifferentCards = Object.keys(cardCounts).length
  const maxCount = Math.max(...Object.values(cardCounts))

  if (maxCount === 5) {
    return 7
  } else if (maxCount === 4) {
    return 6
  } else if (maxCount === 3) {
    if (numberOfDifferentCards === 2) {
      return 5
    } else {
      return 4
    }
  } else if (maxCount === 2) {
    if (numberOfDifferentCards === 3) {
      return 3
    } else {
      return 2
    }
  } else {
    return 1
  }
}

const scoreForHand2 = cards => {
  const score1 = scoreForHand(cards)
  if (!cards.includes('J')) {
    return { bestScore: score1, bestHand: '' }
  }

  const possibles = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2']

  let bestScore = score1
  let bestHand = cards.split('')

  while (bestHand.includes('J')) {
    for (let i = 0; i < bestHand.length; i++) {
      if (bestHand[i] !== 'J') {
        continue
      }

      let foundBetter = false

      for (const possible of possibles) {
        const newCards = [
          ...bestHand.slice(0, i),
          possible,
          ...bestHand.slice(i + 1),
        ]
        const score = scoreForHand(newCards.join(''))
        if (score > bestScore) {
          bestScore = score
          bestHand = newCards
          foundBetter = true
        }
      }

      if (!foundBetter) {
        bestHand[i] = 'x'
      }
    }
  }

  if (bestHand.includes('x')) {
    // the best hand includes the jokers, so replace them with the highest of the other cards
    const otherCards = bestHand.filter(card => card !== 'x')
    let replacement = 'A'
    for (const possible of possibles) {
      if (otherCards.includes(possible)) {
        replacement = possible
        break
      }
    }

    bestHand = bestHand.map(card => (card === 'x' ? replacement : card))
    bestScore = scoreForHand(bestHand.join(''))
  }
  return { bestScore, bestHand: bestHand.join('') }
}

const handAsAlpha = hand => {
  // replace the cards with letters, so they can be sorted directly
  const alpha = hand
    .replaceAll('K', 'B')
    .replaceAll('Q', 'C')
    .replaceAll('J', 'D')
    .replaceAll('T', 'E')
    .replaceAll('9', 'F')
    .replaceAll('8', 'G')
    .replaceAll('7', 'H')
    .replaceAll('6', 'I')
    .replaceAll('5', 'J')
    .replaceAll('4', 'K')
    .replaceAll('3', 'L')
    .replaceAll('2', 'M')
    .replaceAll('1', 'N')

  return alpha
}

const handAsAlpha2 = hand => {
  // handAsAlpha made J into D, now make it the weakest card
  const alpha = handAsAlpha(hand).replaceAll('D', 'O')
  return alpha
}

const totalScore = games => {
  // the games all have a result, so now sort & rank the ones with equal results.

  const handScores = new Set(games.map(game => game.result))
  for (const score of handScores) {
    const gamesWithScore = games
      .filter(game => game.result === score)
      .sort((a, b) => (a.alpha < b.alpha ? 1 : -1))

    for (let i = 0; i < gamesWithScore.length; i++) {
      gamesWithScore[i].decider = i
    }
  }

  for (const game of games) {
    game.rating = game.result * 10000 + game.decider
  }
  games = games.sort((a, b) => (a.rating > b.rating ? 1 : -1))

  let total = 0
  for (let i = 0; i < games.length; i++) {
    games[i].rank = i + 1
    games[i].total = parseInt(games[i].bid) * games[i].rank
    total += games[i].total
  }

  return total
}

module.exports = {
  runPart1,
  runPart2,
}
