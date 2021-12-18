
const maxSecond = 10

// handling for not-found page 
function notFoundPageHandler(req, res) {
  // emit an error to another error handler, i.e., systemErrorHandler
  const error = new Error()
  error.type = 'NOT-FOUND-PAGE'
  throw error
}

// handling for all errors 
// all type of error is following:
// NOT-FOUND-IN-DATABASE: means it can execute query but query result is nothing

// NOT-FOUND-PAGE: means it cannot find any corresponding route

// CANNOT-FIND-IN-DATABASE: means it cannot cannot execute query or 
// there is a problem in execution of the query

// CANNOT-MAP-IN-DATABASE: means the originURL cannot be mapped to URLID in database

function systemErrorHandler(err, req, res, next) {
  // define status code, reason and handler
  let code = 0
  let reason = ''
  let handler = `將於 <span id="countdown-timer">${maxSecond}</span> 秒自動導向首頁`
  const errorType = err.type

  // determine code and reason according to error type
  switch (errorType) {
    // err.type is NOT-FOUND-IN-DATABASE
    case 'NOT-FOUND-IN-DATABASE':
      code = 404
      reason = '沒有對應網址'
      handler = `將於 <span id="countdown-timer">${maxSecond}</span> 秒自動導向上一頁`
      break
    // err.type is NOT-FOUND-PAGE
    case 'NOT-FOUND-PAGE':
      code = 404
      reason = '抱歉！找不到頁面'
      break
    // err.type is CANNOT-MAP-IN-DATABASE
    case 'CANNOT-MAP-IN-DATABASE':
      code = 500
      reason = '無法正常縮短網址'
      break
    // err.type is CANNOT-FIND-IN-DATABASE
    case 'CANNOT-FIND-IN-DATABASE':
      code = 500
      reason = '無法在資料庫進行搜尋'
      break
  }

  // render a page for handling error
  const errorMessage = { errorType, code, reason, handler }
  res.status(code)
  res.render('error', { errorMessage })

}

exports = module.exports = { notFoundPageHandler, systemErrorHandler }