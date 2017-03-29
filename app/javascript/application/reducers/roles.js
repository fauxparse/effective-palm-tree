import { constants as USER } from '../actions/user'
import { constants as ENTITIES } from '../actions/entities'

export default (state = {}, action)  => {
  if (action.type === ENTITIES.REFRESH) {
    return { ...state, ...action.entities.roles }
  } else if (action.type === USER.LOG_OUT) {
    return {}
  } else {
    return state
  }
}
