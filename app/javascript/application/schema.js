import { schema } from 'normalizr'
import moment from 'moment-timezone'

export const invitation = new schema.Entity('invitations', {
  idAttribute: 'token'
})

export const member = new schema.Entity('members', {
  invitations: [invitation]
})

export const role = new schema.Entity('roles')

export const allocation = new schema.Entity('allocations')

export const assignment = new schema.Entity('assignments')

export const group = new schema.Entity('groups', {
  members: [member],
  roles: [role]
}, {
  processStrategy: (attrs, { admin, id }) => ({ ...attrs, admin, memberId: id })
})

export const membership = new schema.Entity('memberships', {
  group: group
})

export const session = new schema.Entity('sessions', {
  memberships: [membership]
})

export const event = new schema.Entity('events', {
  allocations: [allocation],
  assignments: [assignment]
}, {
  idAttribute: 'url',
  processStrategy: (attrs) => ({
    ...attrs,
    startsAt: moment(attrs.startsAt),
    endsAt: moment(attrs.endsAt)
  })
})

invitation.define({ member, admin: member, group })
