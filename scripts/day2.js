const { convertToIntegers } = require('../utils')

const runPart1 = input => {
  const maxRed = 12
  const maxGreen = 13
  const maxBlue = 14

  let validGameIDs = []
  let gameIsValid = true

  for (const line of input) {
    const [game, allShows] = line.split(': ')
    const shows = allShows.split('; ')

    const id = parseInt(game.replace('Game ', ''))

    for (const show of shows) {
      let red = 0
      let green = 0
      let blue = 0
      gameIsValid = true

      const cubes = show.split(', ')
      for (const cube of cubes) {
        const [count, color] = cube.split(' ')
        switch (color) {
          case 'red':
            red += parseInt(count)
            break
          case 'green':
            green += parseInt(count)
            break
          case 'blue':
            blue += parseInt(count)
            break
        }
      }

      if (red > maxRed || green > maxGreen || blue > maxBlue) {
        gameIsValid = false
        break
      }
    }

    if (gameIsValid) {
      validGameIDs.push(id)
    }
  }

  let idSum = validGameIDs.reduce((acc, curr) => acc + curr, 0)
  return idSum
}

const runPart2 = input => {
  let gamePowers = []

  for (const line of input) {
    const [_, allShows] = line.split(': ')
    const shows = allShows.split('; ')

    let minRed = 0
    let minGreen = 0
    let minBlue = 0

    for (const show of shows) {
      const cubes = show.split(', ')
      let red = 0
      let green = 0
      let blue = 0

      for (const cube of cubes) {
        const [count, color] = cube.split(' ')
        switch (color) {
          case 'red':
            red = parseInt(count)
            break
          case 'green':
            green = parseInt(count)
            break
          case 'blue':
            blue = parseInt(count)
            break
        }
      }

      if (red > minRed) {
        minRed = red
      }
      if (green > minGreen) {
        minGreen = green
      }
      if (blue > minBlue) {
        minBlue = blue
      }
    }

    const gamePower = minRed * minGreen * minBlue
    gamePowers.push(gamePower)
  }

  let powerSum = gamePowers.reduce((acc, curr) => acc + curr, 0)
  return powerSum
}

module.exports = {
  runPart1,
  runPart2,
}
