const mongoose = require('mongoose')
const db = require('../../config/mongoose')
const URLIDModel = require('../URLIDModel')
const seedData = require('./URLs.json').results


db.once('open', async () => {

  await URLIDModel.create(seedData)
  db.close()
})