import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { find, findIndex, forEach, keyBy, pick, some, sortBy } from 'lodash'
import fetch from '../lib/fetch'
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
      member,
      assignment,
      className,
      children,
      avatar,
      onDragStart
    } = this.props
    const startDrag = e => onDragStart(e, member, assignment)
    return (
      <li
        className={classNames('member', className, { assigned: assignment })}
        data-member-id={member.id}
        data-allocation-id={assignment ? assignment.allocation.id : 'none'}
      >
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
      role,
      members,
      selections,
      onDragStart
    } = this.props
    const assignments = sortBy(allocation.assignments, a =>
      members[a.memberId].name.toLocaleLowerCase())

    return (
      <section className="role">
        <h4>{allocation.max === 1 ? role.name : role.plural}</h4>
        <ul>
          {assignments.map(assignment => (
            <MemberItem
              key={assignment.memberId}
              assignment={assignment}
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

class EventAssignments extends React.Component {
  constructor(props) {
    super(props)
    this.state = { showAll: false, selections: [] }
    this.dragStart = this.dragStart.bind(this)
    this.dragMove = this.dragMove.bind(this)
    this.dragStop = this.dragStop.bind(this)
  }

  componentWillUnmount() {
    const { dragging } = this.state
    if (dragging) clearTimeout(dragging.dragStartTimer)
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
        <div className="assignments" ref="list">
          {this.roleGroups()}
          {this.available()}
        </div>
        {this.dropTargets()}
      </section>
    )
  }

  roleGroups() {
    const { event, group, members, roles } = this.props
    const { allocations } = event
    const { selections } = this.state

    return allocations.map(allocation => (
      <RoleGroup
        key={allocation.id}
        allocation={allocation}
        event={event}
        role={roles[allocation.roleId]}
        members={members}
        selections={selections}
        onDragStart={(e, member, assignment) =>
          this.dragStart(e, member, assignment)}
      />
    ))
  }

  available() {
    const { event, group, members } = this.props
    const { showAll, selections, dragging } = this.state
    return (
      <section className={classNames('role', 'none', { 'show-all': showAll })}>
        <h4>
          <span>Available</span>
          <small onClick={() => this.setState({ showAll: !showAll })}>
            {showAll ? 'Hide others' : 'Show all'}
          </small>
        </h4>
        <ul>
          {sortBy(members, m => m.name.toLocaleLowerCase())
            .map(m => this.availableMemberItem(event, m, selections))}
        </ul>
      </section>
    )
  }

  availableMemberItem(event, member, selections) {
    const availability = this.props.availability[member.id]
    const available = availability == Event.AVAILABLE
      ? 'available'
      : availability === Event.UNAVAILABLE ? 'unavailable' : 'unknown'
    const icon = ICONS[available.toUpperCase()]
    const avatar = event.isAssigned(member)
      ? false
      : <span className={classNames('avatar', available)}>{icon}</span>
    return (
      <MemberItem
        key={member.id}
        className={available}
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
    const { event, group, roles } = this.props
    const { dragging } = this.state
    const targetId = dragging && dragging.targetId
    return (
      <div
        className="drop-targets"
        ref="dropTargets"
        onTouchMove={e => e.stopPropagation()}
      >
        {event.allocations.map(a =>
          this.dropTarget(a, roles[a.roleId], targetId === a.id))}
        <footer>
          <DropTarget key={-1} id={-1} hover={targetId === -1}>
            <h4>{ICONS.REMOVE}<span>Remove</span></h4>
          </DropTarget>
          <DropTarget key={0} id={0} hover={targetId === 0}>
            <h4>{ICONS.CANCEL}<span>Cancel</span></h4>
          </DropTarget>
        </footer>
        <div
          className={classNames('draggables', {
            multiple: dragging && dragging.selections.length > 1
          })}
          ref="draggables"
        >
          {this.draggables()}
        </div>
      </div>
    )
  }

  dropTarget(allocation, role, hover) {
    const { dragging } = this.state
    const id = allocation.id || allocation
    const count = dragging ? dragging.selections.length : 1
    return (
      <DropTarget key={id} id={id} hover={hover}>
        <h4>{count == 1 ? role.name : role.plural}</h4>
      </DropTarget>
    )
  }

  draggables() {
    const { dragging } = this.state
    if (dragging) {
      return dragging.ghosts.map((ghost, i) =>
        React.cloneElement(ghost, { key: i }))
    }
  }

  dragStart(e, member, assignment) {
    // Stop the same action triggering both touch and mouse events
    if (this.dragStartEvent) return
    this.dragStartEvent = e
    e.persist()
    e.stopPropagation()

    // Prevent mouse scrolling
    if (!isTouchEvent(e)) e.preventDefault()

    const selections = this.state.selections.slice(0)
    const [x, y] = dragPosition(e)
    let item = e.target
    while (!item.classList || !item.classList.contains('member'))
      item = item.parentNode
    const rect = item.getBoundingClientRect()

    if (!selections.length) {
      selections.push([member.id, assignment && assignment.allocation.id])
    }
    const dragging = {
      origin: { x, y },
      offset: { x: x - rect.left, y: y - rect.top },
      item,
      member,
      assignment,
      allocation: assignment && assignment.allocation,
      selections,
      ghosts: [],
      moved: false,
      dragStartTimer: setTimeout(() => this.dragMove(e, true), 300)
    }
    this.setState({ dragging })

    const body = document.querySelector('body')
    if (isTouchEvent(e)) {
      body.addEventListener('touchmove', this.dragMove)
      body.addEventListener('touchend', this.dragStop)
    } else {
      body.addEventListener('mousemove', this.dragMove)
      body.addEventListener('mouseup', this.dragStop)
    }
  }

  dragMove(e, force = false) {
    e.stopPropagation()
    const { dragging } = this.state
    const { draggables } = this.refs
    const [x, y] = dragPosition(e)
    const dx = x - dragging.origin.x
    const dy = y - dragging.origin.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (!dragging.moved && (force || distance > 5)) {
      if (
        !isSelected(dragging.selections, dragging.member, dragging.allocation)
      ) {
        dragging.selections.unshift([
          dragging.member.id,
          dragging.allocation && dragging.allocation.id
        ])
      }
      dragging.moved = true
      clearTimeout(dragging.dragStartTimer)
      dragging.x = x
      dragging.y = y
      const { offset } = dragging
      dragging.ghosts = this.dragGhosts(
        dragging.selections,
        x - offset.x,
        y - offset.y
      )
      setTimeout(
        () => {
          forEach(
            this.refs.draggables.querySelectorAll('.draggable'),
            draggable => {
              const dx = parseInt(draggable.style.left, 10)
              const dy = parseInt(draggable.style.top, 10)
              draggable.style.transform = `translate3d(${-dx}px, ${-dy}px, 0)`
            }
          )
        },
        10
      )
      if (dragging.selections.length > 1) {
        this.setState({ selections: dragging.selections.slice(0) })
      }
    }

    if (dragging.moved) {
      draggables.style.transform = `translate3d(${x}px, ${y}px, 0)`
      dragging.target = find(
        this.refs.dropTargets.querySelectorAll('.drop-target'),
        t => inside(x, y, t.getBoundingClientRect())
      )
      dragging.targetId = dragging.target &&
        parseInt(dragging.target.getAttribute('data-allocation-id'), 10)
    }
    this.setState({ dragging })
  }

  dragStop(e) {
    const { event, onChange } = this.props
    const { dragging, selections } = this.state
    const { moved, member, assignment } = dragging

    clearTimeout(dragging.dragStartTimer)
    setTimeout(
      () => {
        this.dragStartEvent = undefined
      },
      50
    )
    if (moved) {
      if (dragging.targetId) {
        this.updateAssignments(
          dragging.selections,
          parseInt(dragging.targetId, 10)
        )
        this.setState({ selections: [] })
        onChange(event)
      }
    } else {
      this.toggleSelection(member, assignment)
    }

    const body = document.querySelector('body')
    body.removeEventListener('touchmove', this.dragMove)
    body.removeEventListener('touchend', this.dragStop)
    body.removeEventListener('mousemove', this.dragMove)
    body.removeEventListener('mouseup', this.dragStop)
    this.setState({ dragging: false })
  }

  dragGhosts(selections, x, y) {
    const { group, members } = this.props
    const { list } = this.refs
    return selections.map(([memberId, allocationId]) => {
      const listItem = list.querySelector(
        `.member[data-member-id="${memberId}"][data-allocation-id="${allocationId || 'none'}"]`
      )
      const rect = listItem.getBoundingClientRect()
      const dx = x - rect.left
      const dy = y - rect.top
      return (
        <div
          className="draggable"
          style={{
            top: `${-dy}px`,
            left: `${-dx}px`,
            transform: `translate3d(0, 0, 0)`
          }}
        >
          {selections.length === 1 && <Avatar member={members[memberId]} />}
        </div>
      )
    })
  }

  toggleSelection(member, assignment) {
    const { selections } = this.state
    const allocation = assignment && assignment.allocation
    const allocationId = allocation && allocation.id

    const index = findIndex(
      selections,
      ([m, a]) => m === member.id && a === allocationId
    )
    if (index > -1) {
      selections.splice(index, 1)
    } else {
      selections.push([member.id, allocation && allocation.id])
    }
    this.setState({ selections })
  }

  updateAssignments(selections, allocationId) {
    const { event } = this.props
    fetch(event.url + '/assignments', {
      method: 'PATCH',
      body: {
        assignments: selections.map(([memberId, old]) => [
          memberId,
          old || 0,
          allocationId || 0
        ])
      }
    })
    selections.forEach(([memberId, oldAllocationId]) =>
      event.updateAssignment(memberId, oldAllocationId, allocationId))
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
  if (availability === Event.AVAILABLE) {
    return 0
  } else if (availability === Event.UNAVAILABLE) {
    return 2
  } else {
    return 1
  }
}

function isSelected(selections, member, allocation) {
  const memberId = member.id || member
  const allocationId = allocation && allocation.id
  return find(selections, ([m, a]) => m === memberId && a === allocationId)
}

function dragPosition(e) {
  if (isTouchEvent(e)) e = e.targetTouches[0]
  return [e.clientX, e.clientY]
}

function inside(x, y, rect) {
  return x >= rect.left &&
    x < rect.left + rect.width &&
    y >= rect.top &&
    y < rect.top + rect.height
}

function isTouchEvent(e) {
  return e.targetTouches && e.targetTouches.length > 0
}

const mapStateToProps = ({ availability, groups, members, roles }, { event }) => {
  const group = groups[event.groupId]
  return {
    availability: availability[event.url] || {},
    group,
    members: pick(members, group.members),
    roles: pick(roles, group.roles)
  }
}

const mapDispatchToProps = (dispatch, { event }) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(EventAssignments)
