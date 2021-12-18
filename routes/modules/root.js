const express = require('express')
const mongoose = require('mongoose')
// load a function which generates URLID (xxxx)
const generateURLID = require('../../utils/generateURLID')

// load the URLID Model
const URLIDModel = require('../../models/URLIDModel')

const router = express.Router()


router.get('/', (req, res) => {
  res.render('index', { result: null })
})

// GET /:resource: redirect to the corresponding URL according to query result
router.get(/\/[a-zA-Z0-9]{5}$/, (req, res, next) => {
  console.log(Object.keys(req))
})

// POST /: render a index page with query result
// if URL from input bar doesn't exist in database, the system generate a 
// URLID to match that and add (URLID:URL) pair to database. Finally, it 
// render a index page with URLID.

// if URL from input bar exist in database, the system just render a index
// page with query result
router.post('/', (req, res, next) => {

})

exports = module.exports = router