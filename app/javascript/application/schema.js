import { schema } from 'normalizr'

export const member = new schema.Entity('members')

export const role = new schema.Entity('roles')

export const allocation = new schema.Entity('allocations')

export const group = new schema.Entity('groups', {
  members: [member],
  roles: [role]
}, {
  idAttribute: 'slug',
  processStrategy: (attrs, { admin, id }) => ({ ...attrs, admin, memberId: id })
})

export const membership = new schema.Entity('memberships', {
  group: group
})

export const session = new schema.Entity('sessions', {
  memberships: [membership]
})

export const event = new schema.Entity('events', {
  allocations: [allocation]
}, { idAttribute: 'url' })
