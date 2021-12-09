const express = require('express')
const rootRoutes = require('./modules/root')

const router = express.Router()

router.use('/', rootRoutes)

exports = module.exports = rootRoutes