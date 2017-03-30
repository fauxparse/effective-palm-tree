import { constants as USER } from '../actions/user'
import { constants as ENTITIES } from '../actions/entities'
import { constants as EVENTS } from '../actions/events'

const updateAssignments = (events = []) =>
  events.reduce((hash, event) => {
    if (event && event.assignments) {
      hash[event.url] = event.assignments.map(a => ({ ...a }))
    }
    return hash
  }, {})

export default (state = {}, action) => {
  if (action.type === EVENTS.REFRESH) {
    return { ...state, ...updateAssignments(action.events) }
  } else if (action.type === ENTITIES.REFRESH) {
    return { ...state, ...updateAssignments([action.result]) }
  } else if (action.type === USER.LOG_OUT) {
    return {}
  } else {
    return state
  }
}
