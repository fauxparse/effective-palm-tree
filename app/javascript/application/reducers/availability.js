import { constants as AVAILABILITY } from '../actions/availability'
import { constants as USER } from '../actions/user'
import { constants as ENTITIES } from '../actions/entities'
import { constants as EVENTS } from '../actions/events'

const updateAvailability = (events = []) =>
  events.reduce((hash, event) => {
    if (event && event.availability) hash[event.url] = event.availability
    return hash
  }, {})

export default (state = {}, action) => {
  if (action.type === EVENTS.REFRESH) {
    return { ...state, ...updateAvailability(action.events) }
  } else if (action.type === ENTITIES.REFRESH) {
    return { ...state, ...updateAvailability([action.result]) }
  } else if (action.type === USER.LOG_OUT) {
    return {}
  } else {
    return state
  }
}
