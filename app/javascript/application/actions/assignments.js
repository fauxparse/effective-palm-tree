import { query } from '../lib/reactive_query'
import { event as eventSchema } from '../schema'
import { constants as ENTITIES } from './entities'

const constants = {
  ASSIGN: 'assignments.assign'
}

const actions = {
  assign: (event, selections) =>
    query(ENTITIES.REFRESH, event.url + '/assignments', {
      schema: eventSchema,
      method: 'PATCH',
      body: { assignments: selections }
    })
}

export { actions, constants }
