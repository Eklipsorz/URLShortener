
const maxSecond = 10

// handling for not-found page 
function notFoundPageHandler(req, res) {
  // emit an error to another error handler, i.e., systemErrorHandler
  const error = new Error()
  error.type = 'NOT-FOUND-PAGE'
  throw error
}

// handling for all errors (including CANNOT-FIND-DATA and NOT-FOUND-PAGE)
function systemErrorHandler(err, req, res, next) {
  // define status code, reason and handler
  let code = 0
  let reason = ''
  let handler = `將於 <span id="countdown-timer">${maxSecond}</span> 秒自動導向首頁`
  const errorType = err.type

  // determine code and reason according to error type
  switch (errorType) {
    // err.type is CANNOT-FIND-DATA
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
    // If the system add URL into database, that means 500
    case 'CANNOT-ADD-IN-DATABASE':
      code = 500
      reason = '無法正常縮短網址'
      break
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