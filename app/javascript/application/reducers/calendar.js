import { assign, concat, uniq } from 'lodash'
import { constants as USER } from '../actions/user'
import { constants as EVENTS } from '../actions/events'
import Event from '../models/event'

const extractDate = url => url.replace(/^.*(\d{4}-\d{2})-\d{2}\/?$/, '$1')

export default function calendar(state = {}, action) {
  if (action.type == EVENTS.REFRESH) {
    return action.events.reduce((hash, { url }) => {
      const key = extractDate(url)
      hash[key] = uniq(concat(hash[key] || [], [url]))
      return hash
    }, assign({}, state))
  } else if (action.type == USER.LOG_OUT) {
    return {}
  } else {
    return state
  }
}
