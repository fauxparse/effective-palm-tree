import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import events from './events'
import groups from './groups'
import user from './user'

export default combineReducers({ events, groups, routing, user })
