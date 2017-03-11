import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import calendar from './calendar'
import events from './events'
import groups from './groups'
import user from './user'

export default combineReducers({ calendar, events, groups, routing, user })
