import { assign, groupBy, omit, values } from 'lodash'
import { constants as USER } from '../actions/user'
import { constants as ENTITIES } from '../actions/entities'

export default (state = {}, action) => {
  if (action.type === ENTITIES.REFRESH) {
    return {
      ...state,
      ...values(action.entities.invitations).reduce(
        (result, item) => assign(result, { [item.memberId]: item }),
        {}
      )
    }
  } else if (action.type === ENTITIES.DELETE) {
    return omit(state, values(action.entities.invitations).map(
      ({ memberId }) => memberId
    ))
  } else if (action.type === USER.LOGOUT) {
    return {}
  } else {
    return state
  }
}
