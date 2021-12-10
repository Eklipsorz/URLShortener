const express = require('express')
const mongoose = require('mongoose')
const generateURLID = require('../../utils/generateURLID')
const URLIDModel = require('../../models/URLIDModel')


const router = express.Router()


router.use('/:resource', (req, res, next) => {


  let type = ''
  let requiredURL = ''

  const method = req.method
  const resource = req.params.resource
  const regex = new RegExp('^[a-zA-z0-9]{5}$')
  console.log(regex.test(resource))
  switch (true) {
    case method === 'GET' && regex.test(resource):
      console.log('get first')
      type = '200-Redirect'
      requiredURL = resource
      break
    case method === 'POST' && resource === 'URLShorten':
      console.log('post second')
      type = '200-Shorten'
      requiredURL = req.body.url
      break
    default:
      const err = new Error('NOT-FOUND-IN-ROUTES')
      err.type = 'NOT-FOUND-IN-ROUTES'
      next(err)
      return
  }

  res.message = { type, resource, requiredURL }
  console.log('message', res.message)
  next()

})

router.use('/:resource', (req, res, next) => {

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
        throw new Error('Not-Found-In-Database')
      }
      const property = type === '200-Redirect' ? 'originURL' : 'URLID'
      res.message['result'] = !url ? null : url[property]
      console.log(res.message)
      next()
    })
    .catch(error => {
      console.log('error is here')
      next(error)
    })



})


router.get('/:resource', (req, res) => {
  res.redirect(res.message.result)
})

router.post('/URLShorten', (req, res) => {

  let { requiredURL, result } = res.message
  let isExistURL = Boolean(result)

  if (isExistURL) {

    console.log(req.hostname)
    res.render('index', { result })
    console.log('end')
    return
  }

  // if (!isExistURL) {
  //   const URLID = generateURLID(5)
  //   const newURLData = new URLIDModel({
  //     originURL: requiredURL,
  //     URLID
  //   })

  //   newURLData.save()
  //     .then(() => console.log('successfully transformed'))
  //     .catch((error) => console.log(error))
  // }

})


router.get('/', (req, res) => {
  res.render('index')
})

router.use((err, req, res, next) => {

  switch (err.type) {
    case 'NOT-FOUND-IN-ROUTES':
      res.render('404')
      break
  }
})


exports = module.exports = router