
const maxSecond = 10
let restSecond = maxSecond

const countDownTimer = document.querySelector('#countdown-timer')
const timer = setInterval(countDownInErrorPage, 1000)
console.log('hi')
function countDownInErrorPage() {


  countDownTimer.innerHTML = --restSecond

  if (!restSecond) {
    const errorCode = document.querySelector('#error-code').dataset.code
    clearInterval(timer)
    errorCode === '400' ? window.history.back(-1) : window.location.replace("/")

  }

}

