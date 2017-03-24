import React from 'react'
import classNames from 'classnames'
import { find, findIndex, keyBy, some, sortBy } from 'lodash'
import Event from '../models/event'
import Avatar from './avatar'

// prettier-ignore
const ICONS = {
  AVAILABLE: <svg width="32" height="32" viewBox="0 0 32 32"><g transform="translate(.5 .5)"><circle cx="16" cy="16" r="15"/><path d="M9 17l4 4 10-10"/></g></svg>,
  UNAVAILABLE: <svg width="32" height="32" viewBox="0 0 32 32"><g transform="translate(.5 .5)"><circle cx="16" cy="16" r="15"/><path d="M22 10L10 22M22 22L10 10"/></g></svg>,
  UNKNOWN: <svg width="32" height="32" viewBox="0 0 32 32"><g transform="translate(.5 .5)"><circle cx="16" cy="16" r="15"/><path d="M11.4 9c.8-1.8 2.5-3 4.6-3 2.8 0 5 2.2 5 5s-2.2 5-5 5v3"/><path d="M14,25a2,2 0 1,0 4,0a2,2 0 1,0 -4,0"/></g></svg>,
  CHECKBOX: <svg width="24" height="24" viewBox="0 0 24 24"><g transform="translate(.5 .5)"><circle cx="12" cy="12" r="11"/><path d="M6 12l4 4 8-8"/></g></svg>,
  CANCEL: <svg width="24" height="24" viewBox="0 0 24 24"><g transform="translate(.5 .5)"><path d="M19.8 4.2L4.2 19.8"/><circle cx="12" cy="12" r="11"/></g></svg>,
  REMOVE: <svg width="24" height="24" viewBox="0 0 24 24"><g><path d="M20.5 5.5v18h-16v-18M1.5 5.5h22"/><path d="M12.5 11.5v6M8.5 11.5v6M16.5 11.5v6"/><path d="M8.5 5.5v-4h8v4"/></g></svg>
}

class MemberItem extends React.Component {
  render() {
    const {
      event,
      member,
      assignment,
      className,
      children,
      avatar,
      onDragStart
    } = this.props
    const startDrag = e => onDragStart(e, member, assignment)
    return (
      <li className={classNames('member', className, { assigned: assignment })}>
        <span
          className="action"
          onMouseDown={startDrag}
          onTouchStart={startDrag}
        >
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
      return React.cloneElement(ICONS.CHECKBOX, {
        className: classNames('checkbox', { checked: selected })
      })
    } else {
      return avatar || <Avatar member={member} />
    }
  }
}

class RoleGroup extends React.Component {
  render() {
    const {
      allocation,
      event,
      role,
      members,
      selections,
      onDragStart
    } = this.props
    const assignments = sortBy(allocation.assignments, a =>
      members[a.memberId].name.toLocaleLowerCase())

    return (
      <section className="role">
        <h4>{allocation.max == 1 ? role.name : role.plural}</h4>
        <ul>
          {assignments.map(assignment => (
            <MemberItem
              key={assignment.memberId}
              assignment={assignment}
              event={event}
              member={members[assignment.memberId]}
              selected={isSelected(selections, assignment.memberId, allocation)}
              selecting={selections.length > 0}
              onDragStart={onDragStart}
            />
          ))}
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
    this.dragMove = this.dragMove.bind(this)
    this.dragStop = this.dragStop.bind(this)
  }

  render() {
    const { event, group } = this.props
    const { dragging } = this.state
    return (
      <section
        className={classNames('event-assignments', {
          dragging: dragging && dragging.moved
        })}
        role="tabpanel"
      >
        <div className="assignments">
          {this.roleGroups()}
          {this.available()}
        </div>
        {this.dropTargets()}
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
        onDragStart={(e, member, assignment) =>
          this.dragStart(e, member, assignment)}
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
          {group
            .sort()
            .map(m => this.availableMemberItem(event, m, selections))}
        </ul>
      </section>
    )
  }

  availableMemberItem(event, member, selections) {
    let availability = event.availabilityFor(member)
    availability = availability == Event.AVAILABLE
      ? 'available'
      : availability == Event.UNAVAILABLE ? 'unavailable' : 'unknown'
    const icon = ICONS[availability.toUpperCase()]
    const avatar = event.isAssigned(member)
      ? false
      : <span className={classNames('avatar', availability)}>{icon}</span>
    return (
      <MemberItem
        key={member.id}
        className={availability}
        event={event}
        member={member}
        avatar={avatar}
        selected={isSelected(selections, member, undefined)}
        selecting={selections.length > 0}
        onDragStart={(e, member) => this.dragStart(e, member)}
      />
    )
  }

  dropTargets() {
    const { event, group } = this.props
    const { dragging } = this.state
    const targetId = dragging && dragging.targetId
    return (
      <div className="drop-targets" ref="dropTargets">
        {event.allocations.map(a => this.dropTarget(a, group.role(a.roleId), targetId == a.id))}
        <footer>
          <DropTarget key={-1} id={-1} hover={targetId == -1}>
            <h4>{ICONS.REMOVE}<span>Remove</span></h4>
          </DropTarget>
          <DropTarget key={0} id={0} hover={targetId == 0}>
            <h4>{ICONS.CANCEL}<span>Cancel</span></h4>
          </DropTarget>
        </footer>
      </div>
    )
  }

  dropTarget(allocation, role, hover) {
    const { dragging } = this.state
    const id = allocation.id || allocation
    return (
      <DropTarget key={id} id={id} hover={hover}>
        <h4>{role.pluralize(dragging ? dragging.selections.length : 1)}</h4>
      </DropTarget>
    )
  }

  dragStart(e, member, assignment) {
    const selections = this.state.selections.slice(0)
    const [x, y] = dragPosition(e)
    e.stopPropagation()
    let item = e.target
    while (!item.classList || !item.classList.contains('member'))
      item = item.parentNode

    if (!selections.length) {
      selections.push([member.id, assignment && assignment.allocationId])
    }
    const dragging = {
      origin: { x, y },
      item,
      member,
      assignment,
      selections,
      moved: false
    }
    this.setState({ dragging })

    const body = document.querySelector('body')
    body.addEventListener('mouseup', this.dragStop)
    body.addEventListener('touchend', this.dragStop)
    body.addEventListener('mousemove', this.dragMove)
    body.addEventListener('touchmove', this.dragMove)
  }

  dragMove(e) {
    const { dragging } = this.state
    const [x, y] = dragPosition(e)
    const dx = x - dragging.origin.x
    const dy = y - dragging.origin.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (!dragging.moved && distance > 5) {
      dragging.moved = true
      dragging.x = x
      dragging.y = y
    }
    dragging.target = find(
      this.refs.dropTargets.querySelectorAll('.drop-target'),
      t => inside(x, y, t.getBoundingClientRect())
    )
    dragging.targetId = dragging.target &&
      dragging.target.getAttribute('data-allocation-id')
    this.setState({ dragging })
  }

  dragStop(e) {
    const { dragging, selections } = this.state
    const { moved, member, assignment } = dragging

    if (moved) {
      this.setState({ selections: [] })
    } else {
      this.toggleSelection(member, assignment)
    }

    const body = document.querySelector('body')
    body.removeEventListener('mouseup', this.dragStop)
    body.removeEventListener('touchend', this.dragStop)
    body.removeEventListener('mousemove', this.dragMove)
    body.removeEventListener('touchmove', this.dragMove)
    this.setState({ dragging: false })
  }

  toggleSelection(member, assignment) {
    const { selections } = this.state
    const allocation = assignment && assignment.allocation
    const allocationId = allocation && allocation.id

    const index = findIndex(
      selections,
      ([m, a]) => m == member.id && a == allocationId
    )
    if (index > -1) {
      selections.splice(index, 1)
    } else {
      selections.push([member.id, allocation && allocation.id])
    }
    this.setState({ selections })
  }
}

class DropTarget extends React.Component {
  render() {
    const { children, hover, id } = this.props
    return (
      <div
        className={classNames('drop-target', { hover })}
        data-allocation-id={id}
      >
        {children}
      </div>
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

function isSelected(selections, member, allocation) {
  const memberId = member.id || member
  const allocationId = allocation && allocation.id
  return find(selections, ([m, a]) => m == memberId && a == allocationId)
}

function dragPosition(e) {
  if (e.targetTouches && e.targetTouches.length) e = e.targetTouches[0]
  return [e.clientX, e.clientY]
}

function inside(x, y, rect) {
  return x >= rect.left &&
    x < rect.left + rect.width &&
    y >= rect.top &&
    y < rect.top + rect.height
}
