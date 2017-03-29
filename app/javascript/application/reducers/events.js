import { assign, castArray, concat, defaults, keyBy, uniq } from 'lodash'
import moment from 'moment-timezone'
import { constants as USER } from '../actions/user'
import { constants as EVENTS } from '../actions/events'
import Event from '../models/event'

const extractDate = url => url.replace(/^.*(\d{4}-\d{2})-\d{2}\/?$/, '$1')

export default function events(state = {}, action) {
  if (action.type == EVENTS.REFRESH) {
    const events = (action.events || action.data).map(
      event => event instanceof Event ? event.clone() : new Event(event)
    )
    return { ...state, ...keyBy(events, e => e.url) }
  } else if (action.type == USER.LOG_OUT) {
    return {}
  } else {
    return state
  }
}
