import React from 'react'
import { connect } from 'react-redux'
import { assign, difference, forOwn, keys, pick, range, sortBy, values } from 'lodash'
import Tether from 'tether'
import { query } from '../../lib/reactive_query'
import { constants as ENTITIES } from '../../actions/entities'
import { event as eventSchema } from '../../schema'
import Icon from '../icon'
import Select from '../select'
import RangeSlider from '../range_slider'

const UNLIMITED = null

const countString = (allocation) => {
  if (allocation.min === allocation.max) {
    return allocation.min
  } else if (allocation.min) {
    if (allocation.max === UNLIMITED) {
      return `${allocation.min} or more`
    } else {
      return `${allocation.min} to ${allocation.max}`
    }
  } else {
    if (allocation.max === UNLIMITED) {
      return `Some`
    } else {
      return `Up to ${allocation.max}`
    }
  }
}

class AllocationRange extends Select {
  selectedLabel() {
    return countString(this.props.allocation)
  }

  renderDropdown() {
    const { group, allocation } = this.props
    const maximum = group.members.length + 1
    const { min, max } = allocation
    return (
      <div className="select-options">
        <div className="allocation-range list">
          <p>{countString(allocation)}</p>
          <RangeSlider
            min={this.positionFromValue(min)}
            max={this.positionFromValue(max)}
            onDragStart={() => this.setState({ dragging: true })}
            onDragStop={() => this.setState({ dragging: false })}
            onChange={this.onChange.bind(this)}
          />
        </div>
      </div>
    )
  }

  positionPopup() {
    const { portal, trigger } = this.refs
    const dropdown = portal.portal
    const list = dropdown.querySelector('.list')

    let offsetY = 0

    const tether = new Tether({
      element: dropdown,
      target: trigger,
      attachment: 'top left',
      targetAttachment: 'top left',
      targetOffset: '0px -16px',
      constraints: [{ to: 'scrollParent', pin: true }]
    })
    list.style.transformOrigin = '0% 20px'
    this.setState({ tether })
  }

  onChange(min, max) {
    min = this.valueFromPosition(min)
    max = this.valueFromPosition(max)
    this.props.onChange(min, max)
  }

  valueFromPosition(position) {
    const { group } = this.props
    const maximum = group.members.length + 1
    const maxl = Math.log(maximum + 1)
    const value = Math.round(Math.exp(position * maxl)) - 1
    return value === maximum ? UNLIMITED : value
  }

  positionFromValue(value) {
    const { group } = this.props
    const maximum = group.members.length + 1
    const maxl = Math.log(maximum + 1)
    return value === UNLIMITED ? 1.0 : Math.log(value + 1) / maxl
  }
}

class EventRole extends React.Component {
  constructor(props) {
    super(props)
    this.change = this.change.bind(this)
  }

  render() {
    const {
      allocation,
      group,
      onChange,
      onDragStart,
      onDelete,
      offset
    } = this.props
    const roles = sortBy(values(this.props.roles), r => r.name.toLocaleLowerCase())

    return (
      <li
        className="allocation"
        style={{ transform: `translateY(${offset}px)` }}
      >
        <span
          className="drag-handle"
          onMouseDown={onDragStart}
          onTouchStart={onDragStart}
        >
          <Icon name="CONTROLS.DRAG"/>
        </span>
        <AllocationRange
          allocation={allocation}
          group={group}
          onChange={(min, max) => this.change({ min, max })}
        />
        <Select
          selected={allocation.roleId || roles[0].id}
          options={roles.map(({ id, name, plural }) => [
            id,
            allocation.max === 1 ? name : plural
          ])}
          onChange={roleId => this.change({ roleId })}
        />
        <button className="icon-button" onClick={onDelete}>
          <Icon name="CONTROLS.DELETE"/>
        </button>
      </li>
    )
  }

  change(attributes) {
    const { allocation, onChange } = this.props
    forOwn(attributes, (value, key) => { allocation[key] = value })
    onChange(allocation)
  }
}

class EventRoles extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      allocations: props.allocations.slice(0),
      dirty: false
    }
    this.dragStart = this.dragStart.bind(this)
    this.dragMove = this.dragMove.bind(this)
    this.dragStop = this.dragStop.bind(this)
  }

  componentWillReceiveProps({ allocations }) {
    if (allocations) {
      this.setState({
        allocations: allocations.map(a => ({ ...a }))
      })
    }
  }

  render() {
    const { event, group, roles } = this.props
    const { allocations, dirty, dragging } = this.state
    return (
      <section className="event-roles content">
        <ul ref="list">
          {allocations.map((allocation, i) => (
            <EventRole
              key={allocation.id}
              allocation={allocation}
              group={group}
              roles={roles}
              offset={dragging ? dragging.offsets[i] : 0}
              onChange={a => this.changeRole(a, i)}
              onDelete={() => this.deleteRole(allocation)}
              onDragStart={e => this.dragStart(i, e)}
            />
          ))}
        </ul>
        <footer className="buttons">
          <button onClick={this.addRole.bind(this)}>
            <Icon name="CONTROLS.ADD"/>
            <span>Add a role</span>
          </button>
          <button onClick={this.saveChanges.bind(this)} disabled={!dirty}>
            <Icon name="CONTROLS.SAVE"/>
            <span>Save changes</span>
          </button>
        </footer>
      </section>
    )
  }

  addRole() {
    const { event, group, roles, onChange } = this.props
    const { allocations } = this.state
    const ids = allocations.map(a => a.roleId.toString())
    const roleId = difference(keys(roles), ids)[0] || keys(roles)[0]
    if (roleId) {
      const allocation = {
        roleId,
        id: Math.min(0, ...allocations.map(a => a.id)) - 1,
        position: allocations.length,
        min: 0,
        max: UNLIMITED
      }
      allocations.push(allocation)
      this.setState({ allocations, dirty: true })
    }
  }

  changeRole(attributes, index) {
    const { allocations } = this.state
    const allocation = allocations[index]
    forOwn(attributes, (value, key) => { allocation[key] = value })
    this.setState({ allocations, dirty: true })
  }

  deleteRole(allocation) {
    const { allocations } = this.state
    this.setState({
      allocations: allocations.filter(a => a.id !== allocation.id),
      dirty: true
    })
  }

  saveChanges() {
    const { allocations, dirty } = this.state
    if (dirty) {
      this.props.saveChanges(allocations)
      this.setState({ dirty: false })
    }
  }

  dragStart(index, e) {
    const { allocations } = this.state
    const body = document.querySelector('body')
    const y = this.yPosition(e)
    const items = Array.prototype.map.call(
      this.refs.list.querySelectorAll('.allocation'),
      a => a
    )
    const item = items[index]

    item.classList.add('dragging')

    body.addEventListener('mousemove', this.dragMove)
    body.addEventListener('touchmove', this.dragMove)
    body.addEventListener('mouseup', this.dragStop)
    body.addEventListener('touchend', this.dragStop)

    this.setState({
      dragging: {
        index,
        item,
        origin: y,
        moved: false,
        offsets: items.map(_ => 0),
        sorted: items.map(_ => 0),
        heights: items.map(el => el.clientHeight)
      }
    })
  }

  dragMove(e) {
    const { dragging } = this.state
    const { index, origin, heights, offsets } = dragging
    const y = this.yPosition(e)
    const offset = y - origin
    dragging.moved = true
    const top = (i, from) => from.slice(0, i).reduce((t, h) => t + h, 0)
    const tops = heights.map((_, i) => top(i, heights))
    tops[index] += offset
    const sorted = sortBy(range(heights.length), [i => tops[i]])
    const sortedHeights = sorted.map(i => heights[i])
    for (let i = 0; i < sorted.length; i++) {
      offsets[sorted[i]] = top(i, sortedHeights) - tops[sorted[i]]
    }
    offsets[index] = offset
    dragging.sorted = sorted
    this.setState({ dragging, offsets })
  }

  dragStop(e) {
    const { dragging, allocations } = this.state
    const { item, moved, sorted } = dragging
    if (moved) {
      setTimeout(() => {
        this.refs.list.classList.add('settling')
        setTimeout(
          () => {
            this.refs.list.classList.remove('settling')
            dragging.item.classList.remove('dragging')
          },
          300
        )
      })
      this.setState({
        dragging: false,
        dirty: true,
        allocations: sorted.map(i => allocations[i])
      })
    } else {
      item.classList.remove('dragging')
      this.setState({ dragging: false })
    }

    const body = document.querySelector('body')
    body.removeEventListener('mousemove', this.dragMove)
    body.removeEventListener('touchmove', this.dragMove)
    body.removeEventListener('mouseup', this.dragStop)
    body.removeEventListener('touchend', this.dragStop)
  }

  yPosition(e) {
    if (e.targetTouches && e.targetTouches.length) { e = e.targetTouches[0] }
    return e.clientY
  }
}

const mapStateToProps = ({ allocations, groups, roles }, { event }) => {
  const group = groups[event.groupId]
  const eventId = event.url.replace(/\d{4}-\d{2}-\d{2}\/?$/, '')
  return {
    allocations: allocations[eventId] || [],
    group,
    roles: pick(roles, group.roles)
  }
}

const mapDispatchToProps = (dispatch, { event }) => ({
  saveChanges: (roles) => dispatch(query(
    event.url + '/roles',
    {
      schema: eventSchema,
      method: 'PATCH',
      body: { roles }
    }
  ))
})

export default connect(mapStateToProps, mapDispatchToProps)(EventRoles)
