import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import allocations from './allocations'
import assignments from './assignments'
import availability from './availability'
import calendar from './calendar'
import events from './events'
import groups from './groups'
import members from './members'
import roles from './roles'
import user from './user'

export default combineReducers({
  allocations,
  assignments,
  availability,
  calendar,
  events,
  groups,
  members,
  roles,
  routing,
  user
})
