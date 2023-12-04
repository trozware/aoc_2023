const fs = require('fs')

const readFile = (dayNum, folder) => {
  const filePath = `./${folder}/day${dayNum}.txt`
  const fileContents = fs.readFileSync(filePath, 'utf8').trim()
  const data = fileContents.split('\n')
  return data
}

const convertToIntegers = data => {
  return data.map(line => parseInt(line))
}

const isDigit = char => char >= '0' && char <= '9'

const sumArray = array => {
  return array.reduce((sum, value) => sum + value, 0)
}

module.exports = {
  readFile,
  convertToIntegers,
  isDigit,
  sumArray,
}
