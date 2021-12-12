
const maxSecond = 3
let restSecond = maxSecond
const countDownTimer = document.querySelector('#countdown-timer')
const timer = setInterval(countDownInErrorPage, 1000)

function countDownInErrorPage() {


  countDownTimer.innerHTML = --restSecond

  if (!restSecond) {
    clearInterval(timer)
    // window.location.replace("/")
    window.history.back(-1)
  }

}

