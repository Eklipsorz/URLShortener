
// Maximum second in countdown timer
const maxSecond = 10

// Start second in countdown timer
let restSecond = maxSecond

// set a timer to count down for each 1 sec
const countDownTimer = document.querySelector('#countdown-timer')
const intervalTimer = setInterval(countDownInErrorPage, 1000)

// set a handler of the timer 
function countDownInErrorPage() {

  // count down
  countDownTimer.innerHTML = --restSecond

  // if it count down to 0, then the system help user redirect to another page
  // another page: index for this service or previous page user looked up
  if (!restSecond) {

    // get error code (status code)
    const errorCode = document.querySelector('#error-code').dataset.code

    // stop counting down
    clearInterval(intervalTimer)


    // if error code is 404 or 500, then it help user redirect to index page
    // if error code is 400 or, then it help user redirect to previous page 
    // user looked up
    errorCode === '400' ? window.history.back(-1) : window.location.replace("/")

  }

}

