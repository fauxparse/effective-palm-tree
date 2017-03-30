import { assign, concat, uniq } from 'lodash'
import moment from 'moment-timezone'
import { constants as USER } from '../actions/user'
import { constants as EVENTS } from '../actions/events'
import Event from '../models/event'

const extractDate = url => url.replace(/^.*(\d{4}-\d{2})-\d{2}\/?$/, '$1')

const indexByMonth = (state, events) =>
  events.reduce(
    (hash, { url }) => {
      const key = extractDate(url)
      const month = hash[key] || { start: moment(key + '-01', 'YYYY-MM-DD') }
      month.events = uniq(concat(month.events || [], [url]))
      month.loading = false
      return { ...hash, [key]: month }
    },
    { ...state }
  )

const setLoading = (state, start, stop, index, loading) => {
  let date = start.clone()

  while (!date.isAfter(stop)) {
    const key = date.format('YYYY-MM')
    state[key] = {
      events: [],
      ...state[key],
      start: date.clone().startOf('month'),
      loading,
      index
    }
    date.add(1, 'month')
    index++
  }
  return state
}

export default function events(state = {}, action) {
  const { type } = action

  if (type === EVENTS.REFRESH) {
    return indexByMonth(state, action.events)
  } else if (type === EVENTS.FETCHING || type === EVENTS.FETCHED) {
    return setLoading(
      { ...state },
      action.start,
      action.stop,
      action.startIndex,
      type === EVENTS.FETCHING
    )
  } else if (action.type === USER.LOG_OUT) {
    return defaultState()
  } else {
    return state
  }
}
