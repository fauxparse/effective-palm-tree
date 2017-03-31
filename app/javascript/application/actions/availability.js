import { query } from '../lib/reactive_query'
import { event as eventSchema } from '../schema'
import { constants as ENTITIES } from './entities'

const constants = {
  SET: 'availability.set'
}

const actions = {
  set: (event, member, availability) =>
    query(event.url + '/availability', {
      schema: eventSchema,
      method: 'PATCH',
      body: { availability: { [member.id]: availability } }
    })
}

export { actions, constants }
