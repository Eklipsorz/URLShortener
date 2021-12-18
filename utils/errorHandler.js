
// handling for not-found page 
function notFoundPageHandle(req, res) {
  console.log("ghasd")
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
  let handler = '將於 <span id="countdown-timer">10</span> 秒自動導向首頁'

  // determine code and reason according to error type
  switch (err.type) {
    // err.type is CANNOT-FIND-DATA
    case 'CANNOT-FIND-DATA':
      code = 500
      reason = '認證系統目前出現問題'
      break
    // err.type is NOT-FOUND-PAGE
    case 'NOT-FOUND-PAGE':
      code = 404
      reason = '抱歉！找不到頁面'
      break
  }

  // render a page for handling error
  const errorMessage = { code, reason, handler }
  res.status(code)
  res.render('error', { errorMessage })

}

exports = module.exports = { notFoundPageHandle, systemErrorHandler }