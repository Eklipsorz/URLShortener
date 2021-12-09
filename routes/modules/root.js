const express = require('express')
const mongoose = require('mongoose')
const URLIDModel = require('../../models/URLIDModel')


const router = express.Router()

router.get('/', (req, res) => {
  res.render('index')
})


exports = module.exports = router