const express = require('express')
const rootRoutes = require('./modules/root')

const router = express.Router()


router.get('/', (req, res) => {

  res.render('error')
})
// router.use('/', rootRoutes)

exports = module.exports = router