import React from 'react'
import classNames from 'classnames'
import { find, keyBy, sortBy } from 'lodash'
import Event from '../models/event'
import Avatar from './avatar'

class MemberItem extends React.Component {
  render() {
    const { event, member, children } = this.props
    return (
      <li>
        <Avatar member={member}/>
        <span className="name">{member.name}</span>
        {children}
      </li>
    )
  }
}

class RoleGroup extends React.Component {
  render() {
    const { allocation, event, role, members } = this.props
    const assignments = sortBy(allocation.assignments, a => members[a.memberId])

    return (
      <section className="role">
        <h4>{allocation.max == 1 ? role.name : role.plural}</h4>
        <ul>
          {assignments.map((a) => <MemberItem key={a.memberId} event={event} member={members[a.memberId]}/>)}
        </ul>
      </section>
    )
  }
}

export default class EventAssignments extends React.Component {
  render() {
    const { event, group } = this.props
    return (
      <section className="event-assignments" role="tabpanel">
        <div className="assignments">
          {this.roleGroups()}
          {this.available()}
        </div>
      </section>
    )
  }

  roleGroups() {
    const { event, group } = this.props
    const { allocations } = event
    const { roles } = group
    const members = keyBy(group.members, m => m.id)

    return allocations.map(allocation => (
      <RoleGroup
        key={allocation.id}
        allocation={allocation}
        event={event}
        role={find(roles, r => r.id == allocation.roleId)}
        members={members}
      />
    ))
  }

  available() {
    const { event, group } = this.props
    const available = sortBy(
      group.members,
      [
        m => compareAvailability(event.availabilityFor(m)),
        m => m.name.toLocaleLowerCase()
      ]
    )
    return (
      <section className="role none">
        <h4>Available</h4>
        <ul>
          {available.map(m => <MemberItem key={m.id} event={event} member={m}/>)}
        </ul>
      </section>
    )
  }
}

function compareAvailability(availability) {
  if (availability == Event.AVAILABLE) {
    return 0
  } else if (availability == Event.UNAVAILABLE) {
    return 2
  } else {
    return 1
  }
}
