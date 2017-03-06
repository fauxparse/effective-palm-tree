import { constants as USER } from '../actions/user'

export default function user(state = false, { type, user }) {
  if (type == USER.LOG_IN) {
    return { user }
  } else {
    return state
  }
}
