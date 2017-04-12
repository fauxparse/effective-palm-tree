import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { find, findIndex, forEach, keyBy, pick, some, sortBy } from 'lodash'
import Event from '../../models/event'
import Avatar from '../avatar'
import Icon from '../icon'
import { actions as assignmentActions } from '../../actions/assignments'

class MemberItem extends React.Component {
  render() {
    const {
      member,
      allocation,
      className,
      children,
      avatar,
      onDragStart
    } = this.props
    const allocationId = allocation && allocation.id
    const startDrag = e => onDragStart(e, member, allocationId)
    return (
      <li
        className={classNames('member', className, { assigned: allocationId })}
        data-member-id={member.id}
        data-allocation-id={allocationId || 'none'}
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
      return <Icon name="CONTROLS.CHECKBOX" className={['checkbox', { checked: selected }]}/>
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
    return (
      <section className="role">
        <h4>{allocation.max === 1 ? role.name : role.plural}</h4>
        <ul>
          {this.assignments().map(assignment => (
            <MemberItem
              key={assignment.memberId}
              allocation={allocation}
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

  assignments() {
    const { allocation, assignments, members, role } = this.props
    return sortBy(
      assignments,
      a => members[a.memberId].name.toLocaleLowerCase()
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
    if (dragging) { clearTimeout(dragging.dragStartTimer) }
  }

  render() {
    const { event, group } = this.props
    const { dragging } = this.state
    return (
      <section
        className={classNames('event-assignments content', {
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
    const { allocations, assignments, event, group, members, roles } = this.props
    const { selections } = this.state

    return allocations.map(allocation => (
      <RoleGroup
        key={allocation.id}
        assignments={assignments.filter(a => a.allocationId === allocation.id)}
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
    const { assignments } = this.props
    const availability = this.props.availability[member.id]
    const available = Event.availableClass(availability)
    const icon = <Icon name="AVAILABILITY" />
    const avatar = some(assignments, a => a.memberId === member.id)
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
    const { allocations, group, roles } = this.props
    const { dragging } = this.state
    const targetId = dragging && dragging.targetId
    return (
      <div
        className="drop-targets"
        ref="dropTargets"
        onTouchMove={e => e.stopPropagation()}
      >
        {allocations.map(a =>
          this.dropTarget(a, roles[a.roleId], targetId === a.id))}
        <footer>
          <DropTarget key={-1} id={-1} hover={targetId === -1}>
            <h4><Icon name="CONTROLS.REMOVE"/><span>Remove</span></h4>
          </DropTarget>
          <DropTarget key={0} id={0} hover={targetId === 0}>
            <h4><Icon name="CONTROLS.CANCEL"/><span>Cancel</span></h4>
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
    if (role) {
      const { dragging } = this.state
      const id = allocation.id || allocation
      const count = dragging ? dragging.selections.length : 1
      return (
        <DropTarget key={id} id={id} hover={hover}>
          <h4>{count === 1 ? role.name : role.plural}</h4>
        </DropTarget>
      )
    }
  }

  draggables() {
    const { dragging } = this.state
    if (dragging) {
      return dragging.ghosts.map((ghost, i) =>
        React.cloneElement(ghost, { key: i }))
    }
  }

  dragStart(e, member, allocationId) {
    // Stop the same action triggering both touch and mouse events
    if (this.dragStartEvent) { return }
    this.dragStartEvent = e
    e.persist()
    e.stopPropagation()

    // Prevent mouse scrolling
    if (!isTouchEvent(e)) { e.preventDefault() }

    this.startDragging(e, member, allocationId)

    const body = document.querySelector('body')
    if (isTouchEvent(e)) {
      body.addEventListener('touchmove', this.dragMove)
      body.addEventListener('touchend', this.dragStop)
    } else {
      body.addEventListener('mousemove', this.dragMove)
      body.addEventListener('mouseup', this.dragStop)
    }
  }

  startDragging(e, member, allocationId) {
    const { allocations } = this.props
    const selections = this.state.selections.slice(0)
    const [x, y] = dragPosition(e)
    let item = e.target
    while (!item.classList || !item.classList.contains('member')) {
      item = item.parentNode
    }
    const rect = item.getBoundingClientRect()

    if (!selections.length) {
      selections.push([member.id, allocationId])
    }
    const dragging = {
      origin: { x, y },
      offset: { x: x - rect.left, y: y - rect.top },
      item,
      member,
      allocation: find(allocations, a => a.id === allocationId),
      selections,
      ghosts: [],
      moved: false,
      dragStartTimer: setTimeout(() => this.dragMove(e, true), 300)
    }
    this.setState({ dragging })
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
    const { event } = this.props
    const { dragging, selections } = this.state
    const { moved, member, allocation } = dragging

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
      }
    } else {
      this.toggleSelection(member, allocation)
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

  toggleSelection(member, allocation) {
    const { selections } = this.state
    const allocationId = allocation && allocation.id

    const index = findIndex(
      selections,
      ([m, a]) => m === member.id && a === allocationId
    )
    if (index > -1) {
      selections.splice(index, 1)
    } else {
      selections.push([member.id, allocationId])
    }
    this.setState({ selections })
  }

  updateAssignments(selections, allocationId) {
    this.props.assign(
      selections.map(([memberId, old]) => [
        memberId,
        old || 0,
        allocationId || 0
      ])
    )
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
  return some(selections, ([m, a]) => m === memberId && a === allocationId)
}

function dragPosition(e) {
  if (isTouchEvent(e)) { e = e.targetTouches[0] }
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

const mapStateToProps = ({ allocations, assignments, availability, groups, members, roles }, { event }) => {
  const group = groups[event.groupId]
  const eventId = event.url.replace(/\d{4}-\d{2}-\d{2}\/?$/, '')
  return {
    allocations: allocations[eventId] || [],
    assignments: assignments[event.url] || [],
    availability: availability[event.url] || {},
    group,
    members: pick(members, group.members),
    roles: pick(roles, group.roles)
  }
}

const mapDispatchToProps = (dispatch, { event }) => ({
  assign: (selections) => dispatch(assignmentActions.assign(event, selections))
})

export default connect(mapStateToProps, mapDispatchToProps)(EventAssignments)
