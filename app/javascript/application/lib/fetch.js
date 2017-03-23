import { extend, isObject } from 'lodash'

var token

export default function fetchWithCSRF(path, options = {}) {
  if (!token) {
    token = document
      .querySelector('[name="csrf-token"]')
      .getAttribute('content')
  }
  const headers = extend(
    {},
    {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-Token': token
    },
    options.headers
  )
  options = extend({}, { credentials: 'same-origin' }, options, { headers })
  if (isObject(options.body)) options.body = JSON.stringify(options.body)
  return fetch(path, options)
}
