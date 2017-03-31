import { constants as USER } from '../actions/user'
import { constants as ENTITIES } from '../actions/entities'

const extractDate = url => url.replace(/^.*(\d{4}-\d{2})-\d{2}\/?$/, '$1')

export default function events(state = {}, action) {
  if (action.type === ENTITIES.REFRESH && action.entities.events) {
    return { ...state, ...action.entities.events }
  } else if (action.type === USER.LOG_OUT) {
    return {}
  } else {
    return state
  }
}
