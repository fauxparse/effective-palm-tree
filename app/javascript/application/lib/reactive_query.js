import fetch from './fetch'
import { normalize } from 'normalizr'
import { assign, pick, toPairs } from 'lodash'
import moment from 'moment-timezone'

const QUERY = 'query'
const ERROR = 'query.error'
const FETCH_OPTIONS = ['method', 'body']

const query = (name, uri, options = {}) => ({ type: QUERY, name, uri, options })

const encodeValue = (value) =>
  moment.isMoment(value) ? value.format('YYYY-MM-DD') : encodeURIComponent(value)

const queryUri = (uri, params) =>
  uri +
  '?' +
  toPairs({ _: new Date().getTime(), ...params })
    .map(([key, value]) => encodeURIComponent(key) + '=' + encodeValue(value))
    .join('&')

const reactiveFetch = (uri, options, dispatch) =>
  fetch(
    queryUri(uri, options.params),
    pick(options, FETCH_OPTIONS)
  )
  .then(response => response.json())
  .catch(fetchError(options, dispatch))

const fetchError = (options, dispatch) => error =>
  dispatch({
    type: options.onError || ERROR,
    error,
    ...options.params
  })

const before = ({ name, options }, dispatch) =>
  dispatch({ type: name + '.before', ...options.params })

const after = ({ name, options }, dispatch) =>
  dispatch({ type: name + '.after', ...options.params })

const apiResponse = (action, dispatch) => json => {
  const { name, options: { params, schema } } = action
  const key = name.split('.')[0]
  const data = schema ? normalize(json, schema) : { [key]: json }
  dispatch({ type: action.name, ...data, ...action.options.params, action })
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
