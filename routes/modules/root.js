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


// first middleware : 
// Target: filter out the invalid routes and leave some valid routes 
// The invalid routes are transmitted to a middleware for handling error
// On the valid routes: 
// 1. POST / or GET /:resource : the system add message obejct to request 
// object to help second middleware identify these routes and do some 
// database query and finally they are transmitted to next middleware for 
// handling database query
// 
// 2. GET / :  It's transmitted to a middleware for getting index page.
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


  const messageBody = url
  const method = req.method
  const resource = req.params[0] || ''
  const regex = new RegExp('^[a-zA-z0-9]{5}$')

  switch (true) {
    case method === 'GET' && req.originalUrl === '/':
      break
    case method === 'GET' && regex.test(resource):
      type = '200-Redirect'
      requiredURL = resource
      break
    case method === 'POST' && req.originalUrl === '/' && messageBody.length > 0:
      req.url = '/URLShorten'
      type = '200-Shorten'
      requiredURL = messageBody
      break
    default:
      const err = new Error('NOT-FOUND-IN-ROUTES')
      err.type = 'NOT-FOUND-IN-ROUTES'
      next(err)
      return
  }

  res.message = { type, resource, requiredURL }

  next()

})

router.get('/', (req, res) => {
  res.render('index')
})

// second middleware :
// Target: find corresponded URLID or originURL from DB according to request
router.use('/:resource', (req, res, next) => {

  console.log('second middleware')
  const conditionObject = {}
  const { type, requiredURL } = res.message

  // determine type
  const property = type === '200-Redirect' ? 'URLID' : 'originURL'
  conditionObject[property] = requiredURL

  // find
  URLIDModel.findOne(conditionObject)
    .lean()
    .exec()
    .then(url => {
      if (type === '200-Redirect' && !url) {
        const error = new Error('NOT-FOUND-IN-DATABASE')
        error.type = 'NOT-FOUND-IN-DATABASE'
        throw error
      }
      const property = type === '200-Redirect' ? 'originURL' : 'URLID'
      res.message['result'] = !url ? null : url[property]
      next()
    })
    // 400 
    .catch(error => {
      error.type = 'NOT-FOUND-IN-DATABASE'
      next(error)
    })

})
// third middleware 
router.get('/:resource', (req, res) => {
  res.redirect(res.message.result)
})

router.post('/URLShorten', (req, res, next) => {


  let { requiredURL, result } = res.message
  let isExistURL = Boolean(result)

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

  // 500
  newURLData.save()
    .then(() => {
      result = req.protocol + '://' + req.headers.host + '/' + URLID
      res.render('index', { requiredURL, result })
    })
    .catch(error => {
      error.type = 'CANNOT-ADD-DATA-IN-DATABASE'
      next(error)
    })
})



// a middleware for error handling
router.use((err, req, res, next) => {

  console.log('hi error')


  const errorType = err.type
  let code = 0
  let reason = ''
  let handler = `將於 <span id="countdown-timer">${maxSecond}</span> 秒自動導向首頁`

  switch (errorType) {
    case 'NOT-FOUND-IN-ROUTES':
      code = 404
      reason = '抱歉！找不到頁面'
      break
    case 'NOT-FOUND-IN-DATABASE':
      code = 400
      reason = '沒有對應網址'
      handler = `將於 <span id="countdown-timer">${maxSecond}</span> 秒自動導向上一頁`
      break
    case 'CANNOT-ADD-DATA-IN-DATABASE':
      code = 500
      reason = '無法正常縮短網址'
      break
  }



  const errorMessage = { code, reason, handler }
  res.status(code)
  res.render('error', { errorMessage })

})


exports = module.exports = router