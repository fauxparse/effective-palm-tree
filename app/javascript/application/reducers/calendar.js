import { assign, concat, uniq } from 'lodash'
import moment from 'moment-timezone'
import { constants as USER } from '../actions/user'
import { constants as EVENTS } from '../actions/events'
import Event from '../models/event'

const extractDate = url => url.replace(/^.*(\d{4}-\d{2})-\d{2}\/?$/, '$1')

export default function calendar(state = {}, action) {
  if (action.type == EVENTS.REFRESH) {
    return action.events.reduce(
      (hash, { url }) => {
        const key = extractDate(url)
        const month = hash[key] || { start: moment(key + '-01', 'YYYY-MM-DD') }
        month.events = uniq(concat(month.events || [], [url]))
        month.loading = false
        hash[key] = month
        return hash
      },
      assign({}, state)
    )
  } else if (action.type === EVENTS.FETCHING || action.type === EVENTS.FETCHED) {
    state = assign({}, state)
    let date = action.start.clone()
    let index = action.startIndex
    while (date.isBefore(action.stop)) {
      const key = date.format('YYYY-MM')
      state[key] = assign({}, state[key], {
        loading: action.type === EVENTS.FETCHING,
        events: [],
        index
      })
      date.add(1, 'month')
      index++
    }
    return state
  } else if (action.type == USER.LOG_OUT) {
    return {}
  } else {
    return state
  }
}
