import { LOCATION_CHANGE } from 'react-router-redux'
import { constants as SIDEBAR } from '../actions/sidebar'

export default function sidebar(state = false, { type }) {
  switch (type) {
    case LOCATION_CHANGE:
    case SIDEBAR.HIDE:
      return false
    case SIDEBAR.SHOW:
      return true
    default:
      return state
  }
}
