import { isArray } from 'lodash'

const constants = {
  REFRESH: 'events.refresh'
}

const actions = {
  refresh: events => ({
    type: constants.REFRESH,
    events: isArray(events) ? events : [events]
  })
}

export { actions, constants }
