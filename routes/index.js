const express = require('express')
const rootRoutes = require('./modules/root')

const router = express.Router()


router.get('/', (req, res) => {

  const errorMessage = {
    code: '404',
    reason: '無法正常縮短網址',
    handler: `將於 <span id="countdown-timer">3</span> 秒自動導向上ㄧ頁`
  }
  res.render('error', { errorMessage })
})
// router.use('/', rootRoutes)

exports = module.exports = router