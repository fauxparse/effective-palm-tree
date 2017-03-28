import { assign, concat, defaults, keyBy, uniq } from 'lodash'
import moment from 'moment-timezone'
import { constants as USER } from '../actions/user'
import { constants as EVENTS } from '../actions/events'
import Event from '../models/event'

const extractDate = url => url.replace(/^.*(\d{4}-\d{2})-\d{2}\/?$/, '$1')
const defaultState = () => ({ all: {}, calendar: {} })

export default function events(state = defaultState(), action) {
  if (action.type == EVENTS.REFRESH) {
    const events = action.events.map(
      event => event instanceof Event ? event.clone() : new Event(event)
    )
    const all = defaults({}, keyBy(events, event => event.url), state.all)
    const calendar = action.events.reduce(
      (hash, { url }) => {
        const key = extractDate(url)
        const month = hash[key] || { start: moment(key + '-01', 'YYYY-MM-DD') }
        month.events = uniq(concat(month.events || [], [url]))
        month.loading = false
        hash[key] = month
        return hash
      },
      assign({}, state.calendar)
    )
    return { all, calendar }
  } else if (action.type === EVENTS.FETCHING || action.type === EVENTS.FETCHED) {
    const calendar = assign({}, state.calendar)
    let date = action.start.clone()
    let index = action.startIndex
    while (date.isBefore(action.stop)) {
      const key = date.format('YYYY-MM')
      calendar[key] = assign({}, calendar[key], {
        loading: action.type === EVENTS.FETCHING,
        events: [],
        index
      })
      date.add(1, 'month')
      index++
    }
    return defaults({ calendar }, state)
  } else if (action.type == USER.LOG_OUT) {
    return defaultState()
  } else {
    return state
  }
}
