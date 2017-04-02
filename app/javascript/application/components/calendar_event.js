import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { Link } from 'react-router'
import moment from 'moment-timezone'
import Event from '../models/event'
import Icon from './icon'
import { actions as availabilityActions } from '../actions/availability'

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
        <button onClick={this.cycle.bind(this)}>
          <Icon name="AVAILABILITY"/>
        </button>
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
