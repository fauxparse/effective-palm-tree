import { values } from 'lodash'
import { constants as USER } from '../actions/user'
import { constants as ENTITIES } from '../actions/entities'

const eventUrl = (event) => event.url.replace(/\d{4}-\d{2}-\d{2}\/?$/, '')

const updateAllocations = ({ entities, result }) =>
  entities.events[result] &&
    entities.allocations &&
    { [eventUrl(entities.events[result])]: values(entities.allocations) } ||
    {}

export default (state = {}, action) => {
  if (action.type === ENTITIES.REFRESH && action.entities.events) {
    return { ...state, ...updateAllocations(action) }
  } else if (action.type === USER.LOG_OUT) {
    return {}
  } else {
    return state
  }
}
