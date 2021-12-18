// define express server, handlebars create function
const express = require('express')
const { create } = require('express-handlebars')

const app = express()

// define application's router
const router = require('./routes')

// load error handler for route and a set of routes for valid route
const { notFoundPageHandle, systemErrorHandler } = require('./utils/errorHandler')


// begin to connect to MongoDB via mongoose
const db = require('./config/mongoose')


// define port
const port = 3500

// define an object which stores handlebars settings
const handlebarsSettings = {
  extname: '.hbs',
  layoutsDir: 'views/layouts',
  defaultLayout: 'main'
}

// create a handlebars instance
const handlebars = create(handlebarsSettings)

// set view engine to handlebars engine
app.engine('.hbs', handlebars.engine)
app.set('view engine', '.hbs')

// set view path to /views
app.set('views', process.cwd() + '/views')

// set static file root
app.use('/', express.static('public'))

// set body parser for post message
app.use('/', express.urlencoded({ extended: true }))


// bind router to / 
app.use('/', router)

// handling not-found page
app.use('/', notFoundPageHandle)


// handling all error in this system
app.use('/', systemErrorHandler)

// start to listening at port 3500
app.listen(port, () => {
  console.log(`The express server is running at ${port}`)
})


