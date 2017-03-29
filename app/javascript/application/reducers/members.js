import { assign } from 'lodash'
import { constants as USER } from '../actions/user'
import { constants as ENTITIES } from '../actions/entities'

export default (state = {}, action)  => {
  if (action.type === ENTITIES.REFRESH) {
    return { ...state, ...action.entities.members }
  } else if (action.type === USER.LOGOUT) {
    return {}
  } else {
    return state
  }
}
