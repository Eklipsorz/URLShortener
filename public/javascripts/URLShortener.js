const URLForm = document.querySelector('#url-search-form')
const URLFormBtn = document.querySelector('#url-form-btn')

console.log(URLFormBtn)


function onURLFormSubmitted(event) {

  if (!URLForm.checkValidity()) {
    event.preventDefault()
    event.stopPropagation()
  }

}

function onURLFormBtnClicked(event) {

  URLForm.classList.add('was-validated')
}


URLForm.addEventListener('submit', onURLFormSubmitted)
URLFormBtn.addEventListener('click', onURLFormBtnClicked)