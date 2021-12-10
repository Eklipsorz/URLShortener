const express = require('express')
const mongoose = require('mongoose')
const URLIDModel = require('../../models/URLIDModel')


const router = express.Router()



router.use('/:resource', (req, res, next) => {


  let type = ''
  const method = req.method
  const resource = req.params.resource
  const regex = new RegExp('[a-zA-z0-9]{5}')

  switch (true) {
    case method === 'GET' && regex.test(resource):
      type = '200-Redirect'
      break
    case method === 'POST' && resource === 'URLShorten':
      type = '200-Shorten'
      break
    default:
      console.log('awdeaw')
      next(new Error('NOT-FOUND'))
      return
  }

  res.message = {
    type,
    resource
  }
  next()

})

router.use('/:resource', (req, res, next) => {
  console.log('HI THIS MESSAGE', res.message)
})


router.get('/:resource', (req, res) => {

})

router.post('/URLShorten', (req, res) => {

})


router.get('/', (req, res) => {
  res.render('index')
})

router.use((err, req, res, next) => {
  console.log('hi')
})


exports = module.exports = router