// a table including 0-9、a-z and A-Z
const charTable = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

// length of character table
const charTableLength = charTable.length

// the minimum of random number
const start = 0

// the maximum of random number 
const end = charTableLength - 1


// generate a URLID which matches origin URL
// The length of URLID is value of length parameter 
function generateURLID(length) {


  let URLID = ''

  // randomly select a character from charTable for 'length' times
  for (let index = start; index < length; index++) {
    const randomIndex = Math.floor(Math.random() * (end - start + 1) + start)
    URLID += charTable[randomIndex]
  }


  return URLID
}


exports = module.exports = generateURLID