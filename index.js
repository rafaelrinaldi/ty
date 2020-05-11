import markdown from 'snarkdown'
const drag = document.querySelector('[data-drag]')
const dragDefaultLabel = drag.textContent
const customize = document.querySelector('[data-customize]')
const customizeDefaultLabel = customize.textContent
const message = document.querySelector('[data-message]')
const messageDefault = message.innerHTML
const info = document.querySelector('[data-info]')
const STORAGE_KEY = 'THANK_YOU_KEY'
const GITHUB_AUTHORS = ['skmetz', 'jvns', 'cyberglot']

function getMessageTemplate () {
  return localStorage.getItem(STORAGE_KEY) || 'Thanks %s!'
}

function renderMessage () {
  const hasCustomMessage = STORAGE_KEY in localStorage
  if (!hasCustomMessage) return

  const template = getMessageTemplate()
  const authorsMarkup = GITHUB_AUTHORS.map(function (author) {
    return `<a href="https://github.com/${author}"><strong>@${author}</strong></a>`
  })

  const markup = template
    .replace(/\n/g, '<br>')
    .replace('%s', authorsMarkup.join(', '))

  message.innerHTML = markdown(markup)
}

function startCustomization () {
  if (customize.dataset.customize === 'editing') return
  customize.dataset.customize = 'editing'
  drag.classList.add('disabled')
  customize.textContent = 'Save custom message'
  message.innerText = getMessageTemplate()
  message.setAttribute('contenteditable', 'true')
  message.focus()
  info.classList.remove('hidden')
}

function cancelCustomization () {
  if (customize.dataset.customize !== 'editing') return
  drag.classList.remove('disabled')
  customize.dataset.customize = ''
  customize.textContent = customizeDefaultLabel
  message.innerHTML = messageDefault
  message.removeAttribute('contenteditable')
  info.classList.add('hidden')
}

function toggleCustomization () {
  const state = customize.dataset.customize
  const isEditing = state === 'editing'

  if (isEditing) {
    const customMessage = message.innerText
    localStorage.setItem(STORAGE_KEY, customMessage)
    cancelCustomization()
    renderMessage()
    alert('Your custom notification has been saved!')
  } else {
    startCustomization()
  }
}

customize.addEventListener('click', toggleCustomization)

drag.addEventListener('mouseover', function () {
  event.target.textContent = 'Thank You'
})

drag.addEventListener('mouseout', function () {
  event.target.textContent = dragDefaultLabel
})

document.addEventListener('keyup', function (event) {
  if (/^escape$/i.test(event.key)) cancelCustomization()
})

document.addEventListener('DOMContentLoaded', renderMessage)
