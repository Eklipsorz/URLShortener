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
// resource string is combined with a-z, A-Z and 0-9 and string length is 5
router.get(/\/([a-zA-Z0-9]{5})$/, (req, res, next) => {

  const URLID = req.params[0]

  URLIDModel.findOne({ URLID })
    .lean()
    .then(url => {
      // execute a query
      // if result of query about GET /:resource is null, that mean it 
      // cannot find any corresponding URL
      if (!url) {

        // create an error object and it transmit that to a middleware for error
        const error = new Error('NOT-FOUND-IN-DATABASE')
        error.type = 'NOT-FOUND-IN-DATABASE'
        throw error
      }
      // if result of rest queries is not null, that mean it successfully find
      // the corresponding URL and transmit that to third middleware
      res.redirect(url.originURL)
    })
    // accept an error from result of query and transmit that to a middleware
    // for handling error
    .catch(error => {
      error.type = !error.type ? 'CANNOT-FIND-IN-DATABASE' : error.type
      next(error)
    })


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