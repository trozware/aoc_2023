const { readFile } = require('./utils')

const dayNum = 1
const expectedTestResult1 = 1
const expectedTestResult2 = 2

const { runPart1, runPart2 } = require(`./scripts/day${dayNum}`)
const testData = readFile(dayNum, 'test')
const liveData = readFile(dayNum, 'data')

let part1Done = false

const part1 = () => {
  const testResult = runPart1(testData)
  if (testResult === expectedTestResult1) {
    console.log(`Test result ${testResult} passed!`)
    const liveResult = runPart1(liveData)
    console.log(`Live result = ${liveResult}`)
    part1Done = true
  } else {
    console.log(`Test result ${testResult} failed!`)
    console.log(`Expected ${expectedTestResult1}`)
  }
}

const part2 = () => {
  const testResult = runPart2(testData)
  if (testResult === expectedTestResult2) {
    console.log(`Test result ${testResult} passed!`)

    const liveResult = runPart2(liveData)

    console.log(`Live result = ${liveResult}`)
  } else {
    console.log(`Test result ${testResult} failed!`)
    console.log(`Expected ${expectedTestResult2}`)
  }
}

console.time('Run time')
console.log('---------------------------------')
console.log('Day', dayNum)
console.log('---------------------------------')
part1()
console.log('---------------------------------')

if (part1Done) {
  part2()
  console.log('---------------------------------')
}

console.timeEnd('Run time')
console.log('---------------------------------')
