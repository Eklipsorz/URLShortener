const express = require('express')




app = express()
// define port
const port = process.env.port || 3500


app.get('/', () => {
  console.log('hi')
})


app.listen(port, () => {
  console.log(`The express server is running at ${port}`)
})


