import { isObject } from 'lodash'
import 'whatwg-fetch' /*global fetch*/

var _CSRFHeaders

function CSRFHeaders() {
  /*global document*/
  if (!_CSRFHeaders) {
    _CSRFHeaders = {}
    const meta = document.querySelector('[name="csrf-token"]')
    if (meta) {
      _CSRFHeaders['X-CSRF-Token'] = meta.getAttribute('content')
    }
  }
  return _CSRFHeaders
}

export default function fetchWithCSRF(path, options = {}) {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...CSRFHeaders(),
    ...options.headers
  }
  options = { credentials: 'same-origin', ...options, headers }
  if (isObject(options.body)) { options.body = JSON.stringify(options.body) }
  return fetch(path, options)
}
