const runPart1 = input => {
  const races = parseRaces(input)

  for (const race of races) {
    const validPushes = validTimes(race)
    race.validPushes = validPushes.length
  }

  let total = 1
  for (const race of races) {
    total *= race.validPushes
  }

  return total

  // 1624896
}

const runPart2 = input => {
  const time = parseInt(input[0].replace('Time: ', '').replaceAll(' ', ''))
  const distance = parseInt(
    input[1].replace('Distance: ', '').replaceAll(' ', ''),
  )

  const race = { time, distance }
  const validPushes = validTimes(race)

  return validPushes.length

  // 32583852
}

const parseRaces = input => {
  const times = input[0]
    .replace('Time: ', '')
    .split(' ')
    .map(t => parseInt(t))
    .filter(t => !isNaN(t))

  const distances = input[1]
    .replace('Distance: ', '')
    .split(' ')
    .map(d => parseInt(d))
    .filter(d => !isNaN(d))

  let races = []
  for (let i = 0; i < times.length; i++) {
    const time = times[i]
    const distance = distances[i]
    races.push({ time, distance })
  }
  return races
}

const validTimes = race => {
  let validPushes = []
  for (let pushTime = 1; pushTime < race.time; pushTime++) {
    const remainingTime = race.time - pushTime
    const totalDistance = remainingTime * pushTime
    if (totalDistance > race.distance) {
      validPushes.push(pushTime)
    }
  }
  return validPushes
}

module.exports = {
  runPart1,
  runPart2,
}
