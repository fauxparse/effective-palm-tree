import { values } from 'lodash'
import { constants as USER } from '../actions/user'
import { constants as ENTITIES } from '../actions/entities'

export default function user(state = false, action) {
  if (action.type == ENTITIES.REFRESH) {
    return values(action.entities.sessions || {})[0] || state
  } else if (action.type == USER.LOG_OUT) {
    return false
  } else {
    return state
  }
}
