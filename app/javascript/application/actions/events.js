import { isArray } from 'lodash'
import fetch from '../lib/fetch'
import Event from '../models/event'

const constants = {
  REFRESH: 'events.refresh',
  FETCH: 'events.fetch',
  FETCHING: 'events.fetching',
  FETCHED: 'events.fetched'
}

const actions = {
  refresh: events => ({
    type: constants.REFRESH,
    events: isArray(events) ? events : [events]
  }),
  fetch: (start, stop, startIndex) =>
    dispatch => {
      dispatch({ type: constants.FETCHING, start, stop, startIndex })
      return fetch(
        `/events.json?start=${start.format('YYYY-MM-DD')}&stop=${stop.format('YYYY-MM-DD')}`
      )
        .then(response => response.json())
        .then(events => {
          dispatch({ type: constants.FETCHED, start, stop, startIndex })
          dispatch(actions.refresh(events.map(attrs => new Event(attrs))))
        })
    }
}

export { actions, constants }
