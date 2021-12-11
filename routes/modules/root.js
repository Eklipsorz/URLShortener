const express = require('express')
const mongoose = require('mongoose')
const generateURLID = require('../../utils/generateURLID')
const URLIDModel = require('../../models/URLIDModel')

const router = express.Router()


router.use(/\/(.*)/, (req, res, next) => {

  let type = ''
  let requiredURL = ''

  const messageBody = req.body.url || ''
  const method = req.method
  const resource = req.params[0] || ''
  const regex = new RegExp('^[a-zA-z0-9]{5}$')


  switch (true) {
    case method === 'GET' && req.originalUrl === '/':
      console.log('hiiiii')
      break
    case method === 'GET' && regex.test(resource):
      console.log('get first')
      type = '200-Redirect'
      requiredURL = resource
      break
    case method === 'POST' && req.originalUrl === '/' && messageBody.length > 0:
      console.log('post second')
      req.url = '/URLShorten'
      type = '200-Shorten'
      requiredURL = messageBody
      break
    default:
      console.log('inside error')
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

router.use('/:resource', (req, res, next) => {

  console.log('hiDAWEWA')
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
      }
      console.log('test find', url)
      const property = type === '200-Redirect' ? 'originURL' : 'URLID'
      res.message['result'] = !url ? null : url[property]
      next()
    })
    .catch(error => next(error))

})

router.get('/:resource', (req, res) => {
  res.redirect(res.message.result)
})

router.post('/URLShorten', (req, res, next) => {


  let { requiredURL, result } = res.message
  let isExistURL = Boolean(result)

  if (isExistURL) {
    result = req.protocol + '://' + req.headers.host + '/' + result
    res.render('index', { result })
    return
  }
  const URLID = generateURLID(5)
  const newURLData = new URLIDModel({
    originURL: requiredURL,
    URLID
  })


  newURLData.save()
    .then(() => {
      result = req.protocol + '://' + req.headers.host + '/' + URLID
      res.render('index', { result })
    })
    .catch(error => {
      error.type = 'CANNOT-ADD-DATA-IN-DATABASE'
      next(error)
    })
})




router.use((err, req, res, next) => {

  console.log('hi error')
  const errorType = err.type
  switch (errorType) {
    case 'NOT-FOUND-IN-ROUTES':
      res.render('404', {
        errMessage: '抱歉！ 找不到頁面'
      })
      break
    case 'CANNOT-ADD-DATA-IN-DATABASE':
    case 'NOT-FOUND-IN-DATABASE':
      res.render('404', {
        errMessage: '該網址無法正常轉址'
      })
      break
  }


})


exports = module.exports = router