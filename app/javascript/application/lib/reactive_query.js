import fetch from './fetch'
import { normalize } from 'normalizr'
import { assign, pick, toPairs } from 'lodash'
import moment from 'moment-timezone'
import { constants as ENTITIES } from '../actions/entities'

const QUERY = 'query'
const ERROR = 'query.error'
const FETCH_OPTIONS = ['method', 'body']

const query = (uri, options = {}) => ({ type: QUERY, uri, options })

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

const callback = (when, action) =>
  ({ type: callbackName(action) + '.' + when, ...action.options.params })

const callbackName = (action) =>
  action.options && action.options.callback || ENTITIES.REFRESH

const apiResponse = (action, dispatch) => json => {
  const { options: { params, schema } } = action
  const actionCallback = callbackName(action)
  const key = actionCallback.split('.')[0]
  const data = schema ? normalize(json, schema) : { [key]: json }
  dispatch({ type: actionCallback, ...data, ...params, action })
  dispatch(callback('after', action))
}

const reactiveQueryMiddleware = store => next => action => {
  if (action.type === QUERY) {
    store.dispatch(callback('before', action))
    reactiveFetch(action.uri, action.options, store.dispatch)
      .then(apiResponse(action, store.dispatch))
  }
  next(action)
}

export { query, reactiveQueryMiddleware }
