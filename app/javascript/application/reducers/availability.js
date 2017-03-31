import { castArray } from 'lodash'
import { constants as USER } from '../actions/user'
import { constants as ENTITIES } from '../actions/entities'

const updateAvailability = ({ entities: { events = {} }, result }) =>
  castArray(result).reduce((hash, id) => (
    events[id] ? { ...hash, [id]: events[id].availability } : hash
  ), {})

export default (state = {}, action) => {
  if (action.type === ENTITIES.REFRESH && action.entities && action.entities.events) {
    return { ...state, ...updateAvailability(action) }
  } else if (action.type === USER.LOG_OUT) {
    return {}
  } else {
    return state
  }
}
