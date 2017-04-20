import { assign, groupBy, omit, values } from 'lodash'
import { constants as USER } from '../actions/user'
import { constants as ENTITIES } from '../actions/entities'

export default (state = { byMemberId: {}, byToken: {} }, action) => {
  if (action.type === ENTITIES.REFRESH) {
    return {
      byMemberId: {
        ...state.byMemberId,
        ...values(action.entities.invitations).reduce(
          (result, item) => assign(result, { [item.memberId]: item }),
          {}
        )
      },
      byToken: {
        ...state.byToken,
        ...values(action.entities.invitations).reduce(
          (result, item) => assign(result, { [item.token]: item }),
          {}
        )
      }
    }
  } else if (action.type === ENTITIES.DELETE) {
    const invitations = values(action.entities.invitations)
    const memberIds = invitations.map(({ memberId }) => memberId)
    const tokens = invitations.map(({ token }) => token)
    return {
      byMemberId: omit(state.byMemberId, memberIds),
      byToken: omit(state.byToken, tokens)
    }
  } else if (action.type === USER.LOGOUT) {
    return { byMemberId: {}, byToken: {} }
  } else {
    return state
  }
}
