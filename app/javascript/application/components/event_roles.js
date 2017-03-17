import React from 'react'
import { forOwn } from 'lodash'
import Tether from 'tether'
import Select from './select'
import Allocation from '../models/allocation'

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

class RangeSlider extends React.Component {
  constructor(props) {
    super(props)
    this.state = { positions: [props.min, props.max] }
    this.dragMove = this.dragMove.bind(this)
    this.dragStop = this.dragStop.bind(this)
  }

  componentWillReceiveProps(newProps) {
    const { min, max } = newProps
    const [p1, p2] = this.state.positions
    this.setState({
      positions: (p2 < p1) ? [max, min] : [min, max]
    })
  }

  render() {
    const { positions } = this.state
    const [p1, p2] = positions.slice(0).sort()
    return(
      <div className="slider">
        <div className="track" ref="track">
          <div className="selection">
            {positions.map((p, i) => <div className="thumb" key={i} style={{ left: `${p * 100}%`}} onMouseDown={(e) => this.dragStart(i, e)} onTouchStart={(e) => this.dragStart(i, e)}/>)}
            <hr className="range" style={{ left: `${p1 * 100}%`, right: `${100 - p2 * 100}%` }}/>
          </div>
        </div>
      </div>
    )
  }

  dragStart(index, e) {
    const dragging = {
      index,
      offset: this.xPosition(e) - e.target.getBoundingClientRect().left,
      thumb: e.target
    }
    const body = document.querySelector('body')

    dragging.thumb.classList.add('pressed')
    this.setState({ dragging })
    body.addEventListener('mousemove', this.dragMove)
    body.addEventListener('touchmove', this.dragMove)
    body.addEventListener('mouseup', this.dragStop)
    body.addEventListener('touchend', this.dragStop)
    this.props.onDragStart()
  }

  dragMove(e) {
    const { dragging, positions } = this.state
    const trackRect = this.refs.track.getBoundingClientRect()
    positions[dragging.index] = Math.max(0, Math.min(1, (this.xPosition(e) - trackRect.left - dragging.offset) * 1.0 / trackRect.width))
    this.props.onChange(...positions.slice(0).sort())
    this.setState({ positions })
  }

  dragStop(e) {
    e.stopPropagation()
    const { dragging } = this.state
    const body = document.querySelector('body')
    dragging.thumb.classList.remove('pressed')
    body.removeEventListener('mousemove', this.dragMove)
    body.removeEventListener('touchmove', this.dragMove)
    body.removeEventListener('mouseup', this.dragStop)
    body.removeEventListener('touchend', this.dragStop)
    this.setState({ dragging: false })
    this.props.onDragStop()
    setTimeout(() => this.props.onChange(...this.state.positions.slice(0).sort()))
  }

  xPosition(e) {
    if (e.targetTouches && e.targetTouches.length) e = e.targetTouches[0]
    return e.clientX
  }
}

class EventRole extends React.Component {
  constructor(props) {
    super(props)
    this.change = this.change.bind(this)
  }

  render() {
    const { allocation, group, onChange } = this.props
    return (
      <li className="allocation">
        <AllocationRange allocation={allocation} group={group} onChange={(min, max) => this.change({ min, max })}/>
        <Select
          selected={allocation.roleId || group.roles[0].id}
          options={group.roles.map(({ id, name, plural }) => [id, allocation.max == 1 ? name : plural])}
          onChange={(roleId) => this.change({ roleId })}/>
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
  }

  componentDidMount() {
    this.addRole()
  }

  render() {
    const { event, group } = this.props
    const { allocations, dirty } = this.state
    return (
      <section className="event-roles">
        <ul>
          {allocations.map((allocation, i) => <EventRole key={i} allocation={allocation} group={group} onChange={a => this.changeRole(a, i)}/>)}
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
        id: -allocations.length,
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

  saveChanges() {
    const { event, onChange } = this.props
    const { allocations, dirty } = this.state
    if (dirty) {
      event.allocations = allocations
      onChange(event)
      this.setState({ dirty: false })
    }
  }
}
