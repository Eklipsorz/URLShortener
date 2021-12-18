const express = require('express')
const mongoose = require('mongoose')

const url = require('url')
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
router.get(/^\/([a-zA-Z0-9]{5})$/, (req, res, next) => {

  const URLID = req.params[0]

  URLIDModel.findOne({ URLID })
    .lean()
    .then(url => {
      // execute a query
      // if result of query about GET /:resource is null, that mean it 
      // cannot find any corresponding original URL
      if (!url) {

        // create an error object and it transmit that to a middleware for error
        const error = new Error('NOT-FOUND-IN-DATABASE')
        error.type = 'NOT-FOUND-IN-DATABASE'
        throw error
      }
      // if result of rest queries is not null, that mean it successfully finds
      // the original URL and redirects to that
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

// if URL from input bar exists in database, the system just render a index
// page with query result
router.post('/', (req, res, next) => {


  // GET URL from input bar and add '/' to end of the URL according 
  // to whether the URL only has hostname. e.g., http://google.com
  // if the URL only has hostname, then it add / to end of the URL
  // e.g., http://google.com to http://google.com/
  const originURLObject = new URL(req.body.url.trim())
  const originURL = url.format(originURLObject)

  // Find the URLID with origin URL and render a index with that
  // If there is nothing, then it create a document which stores 
  // URLID:originURL in Database and render a index page with URLID
  // IF it successfully find origin URL, then render a index with search result
  URLIDModel.findOne({ originURL })
    .lean()
    .then(url => {
      // execute a query
      // If there is nothing, then it create a document whitch stores 
      // URLID:originURL in Database and render a index page with URLID
      if (!url) {
        // generate a URLID to the corresponding original URL
        const URLID = generateURLID(5)
        // create a document to which stores URLID:originURL in Database
        return URLIDModel.create({ originURL, URLID })
          .then(() => {
            // render a index page with the URLID
            const result = req.protocol + '://' + req.headers.host + '/' + URLID
            res.render('index', { originURL, result })
          })

      }

      // if result of rest queries is not null, that mean it successfully find
      // the corresponding URLID and render a index page with URLID
      const result = req.protocol + '://' + req.headers.host + '/' + url.URLID
      res.render('index', { originURL, result })
    })
    // accept an error from result of query and transmit that to a middleware
    // for handling error
    .catch(error => {
      error.type = 'CANNOT-MAP-IN-DATABASE'
      next(error)
    })



})

exports = module.exports = router