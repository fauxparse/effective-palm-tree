import { assign, defaults, keyBy } from 'lodash'
import { constants as USER } from '../actions/user'
import { constants as EVENTS } from '../actions/events'
import Event from '../models/event'

export default function events(state = {}, action) {
  if (action.type == EVENTS.REFRESH) {
    const events = action.events.map(event => event instanceof Event ? event : new Event(event))
    return defaults(keyBy(events, event => event.url), { _updated: new Date().getTime() }, state)
  } else if (action.type == USER.LOG_OUT) {
    return {}
  } else {
    return state
  }
}
