const express = require('express')
const { create } = require('express-handlebars')
const router = require('./routes')


app = express()

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

app.use('/', express.static('public'))

app.use('/', express.urlencoded({ extended: true }))


app.use('/', router)

app.listen(port, () => {
  console.log(`The express server is running at ${port}`)
})


