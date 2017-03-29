import { isArray } from 'lodash'
import fetch from '../lib/fetch'
import Event from '../models/event'

const constants = {
  REFRESH: 'events.refresh',
  FETCH: 'events.fetch',
  FETCHING: 'events.refresh.before',
  FETCHED: 'events.refresh.after'
}

const actions = {
  refresh: events => ({
    type: constants.REFRESH,
    events: isArray(events) ? events : [events]
  })
}

export { actions, constants }
