const mongoose = require('mongoose')
const Schema = mongoose.Schema

// define data structure for each data
const URLSchema = new Schema({
  originURL: { type: String, required: true },
  URLID: { type: String, required: true }
})

// define a model with url schema and export that model
exports = module.exports = mongoose.model('URLID', URLSchema)