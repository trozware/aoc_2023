const fs = require('fs')

const template = fs.readFileSync('./template.js', 'utf8')

for (let i = 1; i <= 25; i++) {
  fs.writeFileSync(`./test1/day${i}.txt`, '')
  fs.writeFileSync(`./test2/day${i}.txt`, '')
  fs.writeFileSync(`./data/day${i}.txt`, '')
  fs.writeFileSync(`./scripts/day${i}.js`, template)
}
