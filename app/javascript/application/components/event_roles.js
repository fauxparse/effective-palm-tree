import React from 'react'
import { forOwn, range, sortBy } from 'lodash'
import Tether from 'tether'
import Select from './select'
import RangeSlider from './range_slider'
import Allocation from '../models/allocation'

const ICONS = {
  DRAG: <svg width="24" height="24" viewBox="0 0 24 24"><path d="M1.5 5.5h22M1.5 12.5h22M1.5 19.5h22"/></svg>,
  DELETE: <svg width="24" height="24" viewBox="0 0 24 24"><path d="M19.5 5.5l-14 14M19.5 19.5l-14-14"/></svg>
}

class AllocationRange extends Select {
  selectedLabel() {
    return this.props.allocation.countString()
  }

  renderDropdown() {
    const { group, allocation } = this.props
    const maximum = group.members.length + 1
    const { min, max } = allocation
    return (
      <div className="select-options">
        <div className="allocation-range list">
          <RangeSlider min={this.positionFromValue(min)} max={this.positionFromValue(max)} onDragStart={() => this.setState({ dragging: true })} onDragStop={() => this.setState({ dragging: false })} onChange={this.onChange.bind(this)}/>
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
      targetOffset: '40px -16px',
      constraints: [{ to: 'scrollParent', pin: true }]
    })
    list.style.transformOrigin = '0% 0%'
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
    const value = Math.round(Math.exp(position * (maxl))) - 1
    return (value == maximum) ? Allocation.UNLIMITED : value
  }

  positionFromValue(value) {
    const { group } = this.props
    const maximum = group.members.length + 1
    const maxl = Math.log(maximum + 1)
    return (value == Allocation.UNLIMITED) ? 1.0 : (Math.log(value + 1)) / maxl
  }
}

class EventRole extends React.Component {
  constructor(props) {
    super(props)
    this.change = this.change.bind(this)
  }

  render() {
    const { allocation, group, onChange, onDragStart, onDelete, offset } = this.props
    return (
      <li className="allocation" style={{transform: `translateY(${offset}px)`}}>
        <span className="drag-handle" onMouseDown={onDragStart} onTouchStart={onDragStart}>{ICONS.DRAG}</span>
        <AllocationRange allocation={allocation} group={group} onChange={(min, max) => this.change({ min, max })}/>
        <Select
          selected={allocation.roleId || group.roles[0].id}
          options={group.roles.map(({ id, name, plural }) => [id, allocation.max == 1 ? name : plural])}
          onChange={(roleId) => this.change({ roleId })}/>
        <button className="icon-button" onClick={onDelete}>{ICONS.DELETE}</button>
      </li>
    )
  }

  change(attributes) {
    const { allocation, onChange } = this.props
    forOwn(attributes, (value, key) => allocation[key] = value)
    onChange(allocation)
  }
}

export default class EventRoles extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      allocations: props.event.allocations.map(a => a.clone()),
      dirty: false
    }
    this.dragStart = this.dragStart.bind(this)
    this.dragMove = this.dragMove.bind(this)
    this.dragStop = this.dragStop.bind(this)
  }

  render() {
    const { event, group } = this.props
    const { allocations, dirty, dragging } = this.state
    return (
      <section className="event-roles">
        <ul ref="list">
          {allocations.map((allocation, i) => <EventRole key={allocation.id} allocation={allocation} group={group} offset={dragging ? dragging.offsets[i] : 0} onChange={a => this.changeRole(a, i)} onDelete={() => this.deleteRole(allocation)} onDragStart={(e) => this.dragStart(i, e)}/>)}
        </ul>
        <button onClick={this.addRole.bind(this)}>Add a role</button>
        <button onClick={this.saveChanges.bind(this)} disabled={!dirty}>Save changes</button>
      </section>
    )
  }

  addRole() {
    const { event, group, onChange } = this.props
    const { allocations } = this.state
    const ids = allocations.map(a => a.roleId)
    const roleId = ((group.roles.filter(r => ids.indexOf(r.id) == -1))[0] || group.roles[0] || {}).id
    if (roleId) {
      const allocation = new Allocation({
        roleId,
        id: Math.min(0, ...allocations.map(a => a.id)) - 1,
        position: allocations.length,
        min: 0,
        max: Allocation.UNLIMITED
      })
      allocations.push(allocation)
      this.setState({ dirty: true })
    }
  }

  changeRole(attributes, index) {
    const { allocations } = this.state
    const allocation = allocations[index]
    forOwn(attributes, (value, key) => allocation[key] = value)
    this.setState({ allocations, dirty: true })
  }

  deleteRole(allocation) {
    const { allocations } = this.state
    this.setState({
      allocations: allocations.filter(a => a.id != allocation.id),
      dirty: true
    })
  }

  saveChanges() {
    const { event, onChange } = this.props
    const { allocations, dirty } = this.state
    if (dirty) {
      event.allocations = allocations
      onChange(event)
      this.setState({ dirty: false })
    }
  }

  dragStart(index, e) {
    const { allocations } = this.state
    const body = document.querySelector('body')
    const y = this.yPosition(e)
    const items = Array.prototype.map.call(this.refs.list.querySelectorAll('.allocation'), a => a)
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
        setTimeout(() => {
          this.refs.list.classList.remove('settling')
          dragging.item.classList.remove('dragging')
        }, 300)
      })
      this.setState({
        dragging: false,
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
    if (e.targetTouches && e.targetTouches.length) e = e.targetTouches[0]
    return e.clientY
  }
}
