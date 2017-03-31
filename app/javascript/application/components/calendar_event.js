import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { Link } from 'react-router'
import moment from 'moment-timezone'
import Event from '../models/event'
import { actions as availabilityActions } from '../actions/availability'

const ICON = (
  <svg width="40" height="40" viewBox="0 0 40 40">
    <circle cx="19.5" cy="19.5" r="11" />
    <g className="check"><path d="M13.5 19.5l4 4 8-8" /></g>
    <g className="cross">
      <path d="M15.5 15.5l8 8" /><path d="M23.5 15.5l-8 8" />
    </g>
    <g className="question">
      <path d="M19.5 21.5v-1c1.6 0 3-1.4 3-3s-1.4-3-3-3c-1.2 0-2.3.9-2.8 1.9" />
      <path d="M19.5 24.5v1" />
    </g>
  </svg>
)

class CalendarEvent extends React.Component {
  render() {
    const { availability, event, member } = this.props
    const classes = {
      available: availability === Event.AVAILABLE,
      unavailable: availability === Event.UNAVAILABLE,
      unknown: availability !== Event.AVAILABLE && availability !== Event.UNAVAILABLE
    }
    return (
      <li className={classNames(classes)}>
        <button onClick={this.cycle.bind(this)}>{ICON}</button>
        <Link to={event.url}>
          <b>{event.name}</b>
          <small>{event.startsAt.format('h:mmA')}</small>
        </Link>
      </li>
    )
  }

  cycle() {
    const { availability, event, member, setAvailability } = this.props
    if (moment().isBefore(event.startsAt)) {
      setAvailability(event, member, Event.cycleAvailability(availability))
    }
  }
}

const mapStateToProps = ({ groups, members, availability }, { event }) => {
  const memberId = groups[event.groupId].memberId
  return {
    member: members[memberId],
    availability: (availability[event.url] || {})[memberId]
  }
}

const mapDispatchToProps = dispatch => ({
  setAvailability: (event, member, availability) =>
    dispatch(availabilityActions.set(event, member, availability))
})

export default connect(mapStateToProps, mapDispatchToProps)(CalendarEvent)
