import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import user from './user'
import groups from './groups'

export default combineReducers({ user, groups, routing })
