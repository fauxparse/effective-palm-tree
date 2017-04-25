import { query } from '../lib/reactive_query'
import { invitation } from '../schema'
import { constants as ENTITIES } from './entities'

const constants = {
  ACCEPT: 'invitations.accept',
  DECLINE: 'invitations.decline'
}

const actions = {
  accept: (token) =>
    query(`/invitations/${token}/accept`, {
      schema: invitation,
      method: 'POST'
    }),
  decline: (token) =>
    query(`/invitations/${token}/decline`, {
      schema: invitation,
      method: 'POST'
    })
}

export { actions, constants }
