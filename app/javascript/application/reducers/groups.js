import { assign } from 'lodash'
import { constants as USER } from '../actions/user'
import Group from '../models/group'

export default function groups(state = {}, action) {
  if (action.type == USER.LOG_IN) {
    return action.user.memberships.reduce(
      (groups, membership) => {
        const group = new Group(membership.group)
        group.admin = membership.admin || false
        group.memberId = membership.id
        return assign(groups, { [group.slug]: group })
      },
      {}
    )
  } else if (action.type == USER.LOG_OUT) {
    return []
  } else {
    return state
  }
}
