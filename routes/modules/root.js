const express = require('express')
const mongoose = require('mongoose')
const URLIDModel = require('../../models/URLIDModel')


const router = express.Router()



router.use('/:resource', (req, res, next) => {


  let type = ''
  let requiredURL = ''

  const method = req.method
  const resource = req.params.resource
  const regex = new RegExp('[a-zA-z0-9]{5}')

  switch (true) {
    case method === 'GET' && regex.test(resource):
      type = '200-Redirect'
      requiredURL = resource
      break
    case method === 'POST' && resource === 'URLShorten':
      type = '200-Shorten'
      requiredURL = req.body.url
      break
    default:
      next(new Error('NOT-FOUND'))
      return
  }

  res.message = { type, resource, requiredURL }
  next()

})

router.use('/:resource', (req, res, next) => {

  console.log('second use')
  const conditionObject = {}
  const { type, resource, requiredURL } = res.message

  // determine type
  const property = type === '200-Redirect' ? 'URLID' : 'originURL'
  conditionObject[property] = requiredURL


  // find
  URLIDModel.findOne(conditionObject)
    .lean()
    .exec()
    .then(url => {
      if (!url) {
        throw new Error('Not-Found-In-Database')
      }
      const property = type === '200-Redirect' ? 'originURL' : 'URLID'
      res.message['result'] = url[property]
    })
    .catch(() => console.log('find failure'))



})


router.get('/:resource', (req, res) => {

})

router.post('/URLShorten', (req, res) => {

})


router.get('/', (req, res) => {
  res.render('index')
})

router.use((err, req, res, next) => {
  console.log('hi error')
})


exports = module.exports = router