const mongoose = require('mongoose')
const Schema = mongoose.Schema

const URLSchema = new Schema({
  originURL: { type: String, required: true },
  URLID: { type: String, required: true }
})

exports = module.exports = mongoose.model('URLID', URLSchema)