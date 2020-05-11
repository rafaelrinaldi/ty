var url = document.URL || ''
var isGitHubPullRequest = /github.com\/.*\/\.*\pull\/\d*$/.test(url)

if (!isGitHubPullRequest) {
  alert('Looks like you are not looking at a pull request?')
}

var author =
  document.querySelector('.gh-header-meta .author').textContent.trim() || ''

var loggedInUser = document
  .querySelector('meta[name=user-login]')
  .getAttribute('content')
  .trim()

var isPullRequestAuthor = author === loggedInUser

if (!isPullRequestAuthor) {
  alert('Looks like you are not the pull request author?')
}

var status = document.querySelector('[title^="Status:"]').getAttribute('title')
var isOpen = /^Status:\s(.*)$/.exec(status)[1] === 'Open'

if (!isOpen) {
  alert('Looks like the pull request is no longer open?')
}

function $ (selector) {
  var lookup = document.querySelectorAll(selector)
  return [].slice.call(lookup)
}

var reviewers = $('[aria-label*="approved these changes"]')
  .map(function (reviewer) {
    return /[^\s]+/.exec(reviewer.getAttribute('aria-label'))[0]
  })
  .filter(function (reviewer) {
    return reviewer !== author
  })
  .map(function (reviewer) {
    return '@'.concat(reviewer)
  })

var hasReviewers = reviewers || reviewers.lenght

if (!hasReviewers) {
  alert('Looks like nobody has approved your pull request yet?')
}

var message = localStorage.getItem(STORAGE_KEY) || 'Thanks %s!'

var input = document.getElementById('new_comment_field')
var submit = $('button[type=submit]').find(function (node) {
  return /^comment$/i.test(node.textContent.replace(/\s/gm, '').trim())
})

input.textContent = message.replace('%s', reviewers.join(', '))

submit.removeAttribute('disabled')
submit.click()

setTimeout(function () {
  input.removeAttribute('required')
  input.textContent = ''
  submit.setAttribute('disabled', '')
}, 250)
