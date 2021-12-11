const copyBtn = document.querySelector('#copy-btn')

const URLForm = document.querySelector('#url-search-form')
const URLFormBtn = document.querySelector('#url-form-btn')

console.log(URLFormBtn)


async function onCopyBtnClicked(event) {
  const urlResult = document.querySelector('#url-result')
  let copiedText = urlResult.textContent.split('Result: ')[1]
  await navigator.clipboard.writeText(copiedText)
  Swal.fire('已複製', '', 'success')
}


function onURLFormSubmitted(event) {

  if (!URLForm.checkValidity()) {
    event.preventDefault()
    event.stopPropagation()
  }

}

function onURLFormBtnClicked(event) {

  URLForm.classList.add('was-validated')
}


copyBtn.addEventListener('click', onCopyBtnClicked)
URLForm.addEventListener('submit', onURLFormSubmitted)
URLFormBtn.addEventListener('click', onURLFormBtnClicked)
