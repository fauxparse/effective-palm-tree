import { extend } from 'lodash'

var token

export default function fetchWithCSRF(path, options = {}) {
  if (!token) {
    token = document
      .querySelector('[name="csrf-token"]')
      .getAttribute('content')
  }
  const headers = extend({}, {
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRF-Token': token
  }, options.headers)
  options = extend({}, { credentials: 'same-origin' }, options, { headers })
  return fetch(path, options)
}
