import { query } from '../lib/reactive_query'
import { event } from '../schema'
import { constants as ENTITIES } from './entities'

const constants = {
  SET: 'availability.set'
}

const actions = {
  set: (event, member, availability) =>
    query(ENTITIES.REFRESH, event.url + '/availability', {
      schema: event,
      method: 'PATCH',
      body: { availability: { [member.id]: availability } }
    })
}

export { actions, constants }
