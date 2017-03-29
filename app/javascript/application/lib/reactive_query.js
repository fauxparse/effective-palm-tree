import fetch from './fetch'
import { assign, pick, toPairs } from 'lodash'

const QUERY = 'QUERY'
const FETCH_OPTIONS = ['method']

const query = (name, uri, options = {}) => ({ type: QUERY, name, uri, options })

const queryUri = (uri, queryParams) =>
  uri +
  '?' +
  toPairs(assign({ _: new Date().getTime() }, queryParams))
    .map(
      ([key, value]) =>
        encodeURIComponent(key) + '=' + encodeURIComponent(value)
    )
    .join('&')

const reactiveFetch = (uri, options, dispatch) =>
  fetch(
    queryUri(uri, options.queryParams),
    pick(options, FETCH_OPTIONS)
  ).then(response => response.json())

const before = (action, dispatch) =>
  dispatch(assign({ type: action.name + '.before' }, action.options.params))

const after = (action, dispatch) =>
  dispatch(assign({ type: action.name + '.after' }, action.options.params))

const apiResponse = (action, dispatch) => json => {
  dispatch(assign({ type: action.name, data: json }, action.options.params))
  after(action, dispatch)
}

const reactiveQueryMiddleware = store => next => action => {
  if (action.type === QUERY) {
    before(action, store.dispatch)
    reactiveFetch(action.uri, action.options, store.dispatch)
      .then(apiResponse(action, store.dispatch))
  }
  next(action)
}

export { query, reactiveQueryMiddleware }
