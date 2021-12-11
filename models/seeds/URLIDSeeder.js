const mongoose = require('mongoose')
const db = require('../../config/mongoose')

// load the URLID Model
const URLIDModel = require('../URLIDModel')

// define a set of seed data
const seedData = require('./URLs.json').results


// stores seed data via mongoose
db.once('open', async () => {

  await URLIDModel.create(seedData)
  db.close()
})