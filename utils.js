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

module.exports = {
  readFile,
  convertToIntegers,
}
