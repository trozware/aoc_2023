const { convertToIntegers } = require('../utils')

const runPart1 = input => {
  const { seeds, maps } = parseInput(input)

  let locations = []
  for (let seed of seeds) {
    for (const header of mapHeaders) {
      const ranges = maps[header]
      seed = findMatchInRange(ranges, seed)
    }
    locations.push(seed)
  }

  const closestLocation = Math.min(...locations)
  return closestLocation

  // 621354867
}

const runPart2 = input => {
  // it's not pretty but it got there in under 10 minutes.

  const { seeds, maps } = parseInput(input)

  let closestLocation = 999999999999999
  let counter = 0

  for (let i = 0; i < seeds.length; i += 2) {
    let start = seeds[i]
    let count = seeds[i + 1]

    for (let j = 0; j < count; j++) {
      let testSeed = start + j
      for (const header of mapHeaders) {
        const ranges = maps[header]
        testSeed = findMatchInRange(ranges, testSeed)
      }
      if (testSeed < closestLocation) {
        closestLocation = testSeed
      }

      counter++
      if (counter % 10000000 === 0) {
        console.log(counter)
      }
    }
  }

  return closestLocation

  // 15880236
  // Run time: 8:44.616 (m:ss.mmm)
}

const parseInput = input => {
  const seedLine = input[0].replace('seeds: ', '')
  const seeds = convertToIntegers(seedLine.split(' '))

  let maps = {}

  let header = ''
  let dataLines = []

  for (const line of input) {
    if (line.includes(' map:')) {
      header = line.replace(' map:', '')
    } else if (line.trim().length === 0) {
      maps[header] = dataLines
      dataLines = []
    } else {
      const ranges = parseRanges(line)
      dataLines.push(ranges)
    }
  }

  if (dataLines.length > 0) {
    maps[header] = dataLines
  }

  return { seeds, maps }
}

const parseRanges = line => {
  const components = convertToIntegers(line.split(' '))

  const destStart = components[0]
  const destEnd = components[0] + components[2] - 1
  const srcStart = components[1]
  const srcEnd = components[1] + components[2] - 1

  return {
    destStart,
    destEnd,
    srcStart,
    srcEnd,
  }
}

const mapHeaders = [
  'seed-to-soil',
  'soil-to-fertilizer',
  'fertilizer-to-water',
  'water-to-light',
  'light-to-temperature',
  'temperature-to-humidity',
  'humidity-to-location',
]

const findMatchInRange = (ranges, value) => {
  for (const range of ranges) {
    if (value >= range.srcStart && value <= range.srcEnd) {
      return value + range.destStart - range.srcStart
    }
  }

  return value
}

module.exports = {
  runPart1,
  runPart2,
}
