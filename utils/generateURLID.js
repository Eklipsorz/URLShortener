// a table including 0-9、a-z and A-Z
const charTable = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const charTableLength = charTable.length
const start = 0
const end = charTableLength - 1


function generateURLID(length) {

  let URLID = ''

  for (let index = start; index < length; index++) {
    const randomIndex = Math.floor(Math.random() * (end - start + 1) + start)
    URLID += charTable[randomIndex]
  }

  return URLID
}

exports = module.exports = generateURLID