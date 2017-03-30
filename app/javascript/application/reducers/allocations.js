import { values } from 'lodash'
import { constants as USER } from '../actions/user'
import { constants as ENTITIES } from '../actions/entities'
import { constants as EVENTS } from '../actions/events'

const eventUrl = (event) => event.url.replace(/\d{4}-\d{2}-\d{2}\/?$/, '')

const updateAllocations = ({ entities, result }) =>
  entities &&
    entities.events &&
    entities.events[result] &&
    entities.allocations &&
    { [eventUrl(entities.events[result])]: values(entities.allocations) } ||
    {}

export default (state = {}, action) => {
  if (action.type === EVENTS.REFRESH) {
    return { ...state, ...updateAllocations(action.events) }
  } else if (action.type === ENTITIES.REFRESH) {
    return { ...state, ...updateAllocations(action) }
  } else if (action.type === USER.LOG_OUT) {
    return {}
  } else {
    return state
  }
}
