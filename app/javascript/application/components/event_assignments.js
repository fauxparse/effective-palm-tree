import React from 'react'
import classNames from 'classnames'
import { find, findIndex, keyBy, some, sortBy } from 'lodash'
import Event from '../models/event'
import Avatar from './avatar'

const ICONS = {
  AVAILABLE: <svg width="32" height="32" viewBox="0 0 32 32"><g transform="translate(.5 .5)"><circle cx="16" cy="16" r="15"/><path d="M9 17l4 4 10-10"/></g></svg>,
  UNAVAILABLE: <svg width="32" height="32" viewBox="0 0 32 32"><g transform="translate(.5 .5)"><circle cx="16" cy="16" r="15"/><path d="M22 10L10 22M22 22L10 10"/></g></svg>,
  UNKNOWN: <svg width="32" height="32" viewBox="0 0 32 32"><g transform="translate(.5 .5)"><circle cx="16" cy="16" r="15"/><path d="M11.4 9c.8-1.8 2.5-3 4.6-3 2.8 0 5 2.2 5 5s-2.2 5-5 5v3"/><path d="M14,25a2,2 0 1,0 4,0a2,2 0 1,0 -4,0"/></g></svg>,
  CHECKBOX: <svg width="24" height="24" viewBox="0 0 24 24"><g transform="translate(.5 .5)"><circle cx="12" cy="12" r="11"/><path d="M6 12l4 4 8-8"/></g></svg>
}

class MemberItem extends React.Component {
  render() {
    const { event, member, assignment, className, children, avatar, onDragStart } = this.props
    const startDrag = (e) => onDragStart(e, member, assignment)
    return (
      <li className={classNames('member', className, { assigned: assignment })}>
        <span className="action" onMouseDown={startDrag} onTouchStart={startDrag}>
          {this.avatar()}
        </span>
        <span className="name">{member.name}</span>
        {children}
      </li>
    )
  }

  avatar() {
    const { selected, selecting, avatar, member } = this.props
    if (selecting) {
      return React.cloneElement(ICONS.CHECKBOX, { className: classNames('checkbox', { checked: selected }) })
    } else {
      return avatar || <Avatar member={member}/>
    }
  }
}

class RoleGroup extends React.Component {
  render() {
    const { allocation, event, role, members, selections, onDragStart } = this.props
    const assignments = sortBy(allocation.assignments, a => members[a.memberId].name.toLocaleLowerCase())

    return (
      <section className="role">
        <h4>{allocation.max == 1 ? role.name : role.plural}</h4>
        <ul>
          {assignments.map((assignment) => <MemberItem key={assignment.memberId} assignment={assignment} event={event} member={members[assignment.memberId]} selected={isSelected(selections, assignment.memberId, allocation)} selecting={selections.length > 0} onDragStart={onDragStart}/>)}
        </ul>
      </section>
    )
  }
}

export default class EventAssignments extends React.Component {
  constructor(props) {
    super(props)
    this.state = { showAll: false, selections: [] }
    this.dragStart = this.dragStart.bind(this)
    this.dragStop = this.dragStop.bind(this)
  }

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
    const { selections } = this.state
    const members = keyBy(group.members, m => m.id)

    return allocations.map(allocation => (
      <RoleGroup
        key={allocation.id}
        allocation={allocation}
        event={event}
        role={find(roles, r => r.id == allocation.roleId)}
        members={members}
        selections={selections}
        onDragStart={(e, member, assignment) => this.dragStart(e, member, assignment)}
      />
    ))
  }

  available() {
    const { event, group } = this.props
    const { showAll, selections } = this.state
    return (
      <section className={classNames('role', 'none', { 'show-all': showAll })}>
        <h4>
          <span>Available</span>
          <small onClick={() => this.setState({ showAll: !showAll })}>
            {showAll ? 'Hide others' : 'Show all'}
          </small>
        </h4>
        <ul>
          {group.sort().map(m => this.availableMemberItem(event, m, selections))}
        </ul>
      </section>
    )
  }

  availableMemberItem(event, member, selections) {
    let availability = event.availabilityFor(member)
    availability = (availability == Event.AVAILABLE) ? 'available' : (availability == Event.UNAVAILABLE) ? 'unavailable' : 'unknown'
    const icon = ICONS[availability.toUpperCase()]
    const avatar = event.isAssigned(member) ? false : <span className={classNames('avatar', availability)}>{icon}</span>
    return (
      <MemberItem key={member.id} className={availability} event={event} member={member} avatar={avatar} selected={isSelected(selections, member, undefined)} selecting={selections.length > 0} onDragStart={(e, member) => this.dragStart(e, member)}/>
    )
  }

  dragStart(e, member, assignment) {
    e.stopPropagation()
    let item = e.target
    while (!item.classList || !item.classList.contains('member')) item = item.parentNode
    const dragging = {
      item,
      member,
      assignment,
      moved: false
    }
    this.setState({ dragging })

    const body = document.querySelector('body')
    body.addEventListener('mouseup', this.dragStop)
    body.addEventListener('touchend', this.dragStop)
  }

  dragStop(e) {
    const { dragging, selections } = this.state
    const { moved, member, assignment } = dragging

    if (!moved) {
      this.toggleSelection(member, assignment)
    }

    const body = document.querySelector('body')
    body.removeEventListener('mouseup', this.dragStop)
    body.removeEventListener('touchend', this.dragStop)
    this.setState({ dragging: false })
  }

  toggleSelection(member, assignment) {
    const { selections } = this.state
    const allocation = assignment && assignment.allocation
    const allocationId = allocation && allocation.id

    const index = findIndex(selections, ([m, a]) => m == member.id && a == allocationId)
    if (index > -1) {
      selections.splice(index, 1)
    } else {
      selections.push([member.id, allocation && allocation.id])
    }
    this.setState({ selections })
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

function isSelected(selections, member, allocation) {
  const memberId = member.id || member
  const allocationId = allocation && allocation.id
  return find(selections, ([m, a]) => m == memberId && a == allocationId)
}
