// obtain a set of html elements
// copyBtn = a copy button
// URLForm = a URL Shortener Bar
// URLFormBtn = a submit button of a URL Shortener Bar 
const copyBtn = document.querySelector('#copy-btn')
const URLForm = document.querySelector('#url-shortener-form')
const URLFormBtn = document.querySelector('#url-shortener-form-btn')


// define a event handler for clicking CopyBtn
async function onCopyBtnClicked(event) {

  // obtain a shortened URL 
  const urlResult = document.querySelector('#url-result')
  let copiedText = urlResult.textContent.split('Result: ')[1]

  // move the shortened URL into the clipboard
  await navigator.clipboard.writeText(copiedText)

  // show a alert to remind each user it has copied that url
  Swal.fire('已複製', '', 'success')
}

// define a event handler for submitting URLForm
function onURLFormSubmitted(event) {

  // close default event handler 
  if (!URLForm.checkValidity()) {
    event.preventDefault()
    event.stopPropagation()
  }

}

// define a event handler for clicking FormBtn
function onURLFormBtnClicked(event) {

  // when a user clicks the button, the system begins to validate the form
  URLForm.classList.add('was-validated')

}



// add some event listeners to copyBtn, URLForm and URLFormBtn

if (copyBtn) {
  copyBtn.addEventListener('click', onCopyBtnClicked)
}

URLForm.addEventListener('submit', onURLFormSubmitted)
URLFormBtn.addEventListener('click', onURLFormBtnClicked)
