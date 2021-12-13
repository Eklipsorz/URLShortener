const express = require('express')
const mongoose = require('mongoose')
// load a function which generates URLID (xxxx)
const generateURLID = require('../../utils/generateURLID')

// load the URLID Model
const URLIDModel = require('../../models/URLIDModel')

const router = express.Router()


const maxSecond = 10


// There three valid routes 
// 1st Route GET /  : GET Index Page
// 2nd Route POST / : Shorten URL and store that into Database
// 3rd Route GET /:resource : Get originURL from DB and redirect to originURL

// Each route need to be passed some middlewares for handing: 
// GET / route: first middleware -> third middleware
// POST / route: first middleware -> second middleware -> third middleware
// GET /:resource: first middleware -> second middleware -> third middleware
// Error handling : current middleware -> a error for handing error



// first middleware : 
// Target: redirect all type of route according to that whether a route is valid
// If a route is GET /, POST / or GET /:rosource, then it's a valid route. 
// Otherwise, it's a invalid route.
//
// The invalid routes are transmitted to a middleware for handling error
// The valid routes are transmitted to a middleware for handling that: 
// 1. POST / or GET /:resource : the system add message obejct to response
// object to help second middleware identify these routes and do some 
// database query and finally they are transmitted to second middleware for 
// handling database query
// 
// 2. GET / :  It's transmitted to a middleware for getting index page.

// /\/(.*)/ => accept / and /something
router.use(/\/(.*)/, (req, res, next) => {


  let type = ''
  let requiredURL = ''
  let url = ''


  // make the content user inputs be more valid
  if (Object.keys(req.body).length > 0) {
    const regex = new RegExp('^(https:\/\/|http:\/\/).*\/.*')
    // trim some additional spaces
    url = req.body.url.trim()

    // if url is http://hostname:port or https://hostname:port
    // the system add '/' suffix to end of the url 
    // e.g., http://localhost  -> http://localhost/
    // but if url is http://localhost:port /path, it do nothing.
    url = !regex.test(url) ? url + '/' : url

  }

  // obtain a method, url and resource from each route and POST packet
  const messageBody = url
  const method = req.method
  const resource = req.params[0] || ''

  const regex = new RegExp('^[a-zA-z0-9]{5}$')


  // add message obejct to response object according to whether a route is valid
  switch (true) {
    // GET / route
    case method === 'GET' && req.originalUrl === '/':
      break
    // GET /:resource route
    case method === 'GET' && regex.test(resource):
      type = '200-Redirect'
      requiredURL = resource
      break
    // POST route
    case method === 'POST' && req.originalUrl === '/' && messageBody.length > 0:
      // change POST / into POST /URLShorten for security and make that route 
      // be captured by third middleware
      req.url = '/URLShorten'
      type = '200-Shorten'
      requiredURL = messageBody
      break
    // All invalid routes
    default:
      const err = new Error('NOT-FOUND-IN-ROUTES')
      err.type = 'NOT-FOUND-IN-ROUTES'
      next(err)
      return
  }


  res.message = { type, resource, requiredURL }

  // transmitted to second middleare
  next()

})


// second middleware :
// Target: find corresponding URLID or originURL from DB according to message object
// This middleware is only for all type of valid route.
router.use('/:resource', (req, res, next) => {

  const conditionObject = {}
  const { type, requiredURL } = res.message

  // if type value of message object is POST /, then it just create
  // a database query about URLID (xxxxx).

  // if type value of message object is GET /:resourse, then is just create
  // a database query about origin URL.
  const property = type === '200-Redirect' ? 'URLID' : 'originURL'
  conditionObject[property] = requiredURL
  URLIDModel.findOne(conditionObject)
    .lean()
    .exec()
    .then(url => {
      // execute a query
      // if result of query about GET /:resource is null, that mean it 
      // cannot find any corresponding URL
      if (type === '200-Redirect' && !url) {

        // create an error object and it transmit that to a middleware for error
        const error = new Error('NOT-FOUND-IN-DATABASE')
        error.type = 'NOT-FOUND-IN-DATABASE'
        throw error
      }
      // if result of rest queries is not null, that mean it successfully find
      // the corresponding URL and transmit that to third middleware
      const property = type === '200-Redirect' ? 'originURL' : 'URLID'
      res.message['result'] = !url ? null : url[property]
      next()
    })
    // accept an error from result of query and transmit that to a middleware
    // for handling error
    .catch(error => {
      next(error)
    })

})


// third middleware:
// Target: transmit valid route to handler according type of route
// GET / route: render a index page
// GET /:resource: redirect to the corresponding URL according to query result
// POST /: render a index page with query result
// This middleware is only for all type of valid route.


// GET / route: render a index page
router.get('/', (req, res) => {
  res.render('index')
})

// GET /:resource: redirect to the corresponding URL according to query result
router.get('/:resource', (req, res) => {
  res.redirect(res.message.result)
})

// POST /: render a index page with query result
// if URL from input bar doesn't exist in database, the system generate a 
// URLID to match that and add (URLID:URL) pair to database. Finally, it 
// render a index page with URLID.

// if URL from input bar exist in database, the system just render a index
// page with query result
router.post('/URLShorten', (req, res, next) => {


  let { requiredURL, result } = res.message
  let isExistURL = Boolean(result)


  // if URL from input bar exist in database, the system just render a index
  // page with query result
  if (isExistURL) {
    result = req.protocol + '://' + req.headers.host + '/' + result
    res.render('index', { requiredURL, result })
    return
  }
  const URLID = generateURLID(5)
  const newURLData = new URLIDModel({
    originURL: requiredURL,
    URLID
  })

  // if URL from input bar doesn't exist in database, the system generate a
  // URLID to match that and add (URLID:URL) pair to database. Finally, it 
  // render a index page with URLID.
  newURLData.save()
    .then(() => {
      result = req.protocol + '://' + req.headers.host + '/' + URLID
      res.render('index', { requiredURL, result })
    })
    // if the system cannot add any data into database, then generate an error
    // and transmit that to a middleware for handling error
    .catch(error => {
      error.type = 'CANNOT-ADD-DATA-IN-DATABASE'
      next(error)
    })
})



// a middleware for error handling
router.use((err, req, res, next) => {

  const errorType = err.type
  // the followings are properties of an error message 
  let code = 0
  let reason = ''
  let handler = `將於 <span id="countdown-timer">${maxSecond}</span> 秒自動導向首頁`

  // add an error message according to error type 
  switch (errorType) {
    // If error is from invalid route, that means 404
    case 'NOT-FOUND-IN-ROUTES':
      code = 404
      reason = '抱歉！找不到頁面'
      break
    // If URL doesn't in database, that means 400
    case 'NOT-FOUND-IN-DATABASE':
      code = 400
      reason = '沒有對應網址'
      handler = `將於 <span id="countdown-timer">${maxSecond}</span> 秒自動導向上一頁`
      break
    // If the system add URL into database, that means 500
    case 'CANNOT-ADD-DATA-IN-DATABASE':
      code = 500
      reason = '無法正常縮短網址'
      break
  }


  const errorMessage = { code, reason, handler }
  // response with status code
  res.status(code)
  // render a error page with an error message
  res.render('error', { errorMessage })

})


exports = module.exports = router