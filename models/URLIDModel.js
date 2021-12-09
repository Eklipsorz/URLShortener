const mongoose = require('mongoose')
const GeneralSchema = mongoose.Schema

const URLSchema = new GeneralSchema({
  originURL: { type: String, required: true },
  URLID: { type: String, required: true }
})

exports = module.exports = mongoose.model('URLID', URLSchema)