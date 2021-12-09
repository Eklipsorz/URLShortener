const mongoose = require('mongoose')

// define a port for database system 
const dbPort = 27017
// define a database on the database system
const dbName = 'URLShortener'


mongoose.connect(`mongodb://localhost:${dbPort}/${dbName}`)
const db = mongoose.connection


db.on('error', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongodb connected!')
})


exports = module.exports = db