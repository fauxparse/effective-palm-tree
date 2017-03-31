import { concat, uniq, values } from 'lodash'
import moment from 'moment-timezone'
import { constants as USER } from '../actions/user'
import { before, constants as ENTITIES } from '../actions/entities'

const extractDate = url => url.replace(/^.*(\d{4}-\d{2})-\d{2}\/?$/, '$1')

const indexByMonth = (state, events) => {
  return values(events).reduce(
    (hash, { url }) => {
      const key = extractDate(url)
      const month = hash[key] || { start: moment(key + '-01', 'YYYY-MM-DD') }
      month.events = uniq(concat(month.events || [], [url]))
      month.loading = false
      return { ...hash, [key]: month }
    },
    { ...state }
  )
}

const setLoading = (state, start, stop, index, loading) => {
  let date = start.clone()

  while (date.isBefore(stop)) {
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

  if (type === ENTITIES.REFRESH && action.start) {
    if (action.start) {
      state = setLoading(
        { ...state },
        action.start,
        action.stop,
        action.startIndex,
        false
      )
    }
    return indexByMonth(state, action.entities.events || {})
  } else if (type === before(ENTITIES.REFRESH) && action.start) {
    return setLoading(
      { ...state },
      action.start,
      action.stop,
      action.startIndex,
      true
    )
  } else if (action.type === USER.LOG_OUT) {
    return {}
  } else {
    return state
  }
}
