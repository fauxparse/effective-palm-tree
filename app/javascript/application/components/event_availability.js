import React from 'react'
import { connect } from 'react-redux'
import { pick, sortBy } from 'lodash'
import moment from 'moment-timezone'
import classNames from 'classnames'
import { actions as availabilityActions } from '../actions/availability'
import Event from '../models/event'
import Avatar from './avatar'

// prettier-ignore
const ICONS = {
  AVAILABLE: <svg width="32" height="32" viewBox="0 0 32 32"><g transform="translate(.5 .5)"><circle cx="16" cy="16" r="15"/><path d="M9 17l4 4 10-10"/></g></svg>,
  UNAVAILABLE: <svg width="32" height="32" viewBox="0 0 32 32"><g transform="translate(.5 .5)"><circle cx="16" cy="16" r="15"/><path d="M22 10L10 22M22 22L10 10"/></g></svg>,
  UNKNOWN: <svg width="32" height="32" viewBox="0 0 32 32"><g transform="translate(.5 .5)"><circle cx="16" cy="16" r="15"/><path d="M11.4 9c.8-1.8 2.5-3 4.6-3 2.8 0 5 2.2 5 5s-2.2 5-5 5v3"/><path d="M14,25a2,2 0 1,0 4,0a2,2 0 1,0 -4,0"/></g></svg>,
  ALL: <svg width="32" height="32" viewBox="0 0 32 32"><g transform="translate(.5 .5)"><g className="icon-yes"><path d="M9 17l4 4 10-10"/></g><g className="icon-no"><path d="M10 10L22 22"/><path d="M22 10L10 22"/></g><g className="icon-unknown"><path d="M11.4 9c.8-1.8 2.5-3 4.6-3 2.8 0 5 2.2 5 5s-2.2 5-5 5v3"/><circle cx="16" cy="25" r="2"/></g></g></svg>
}

class MyAvailability extends React.Component {
  render() {
    const { availability, onChange } = this.props
    return (
      <div className="my-availability" data-availability={availability}>
        <p className="instructions">Are you available?</p>
        <div className="buttons">
          <button
            rel="yes"
            onClick={() => this.changeAvailability(Event.AVAILABLE)}
          >
            {ICONS.AVAILABLE}
          </button>
          <button
            rel="no"
            onClick={() => this.changeAvailability(Event.UNAVAILABLE)}
          >
            {ICONS.UNAVAILABLE}
          </button>
        </div>
        <p className="status">{this.statusMessage()}</p>
      </div>
    )
  }

  changeAvailability(value) {
    const { availability, onChange } = this.props
    switch (availability) {
    case Event.AVAILABLE:
    case Event.UNAVAILABLE:
      onChange(Event.UNKNOWN)
      break
    default:
      onChange(value)
    }
  }

  statusMessage() {
    const { availability } = this.props
    return `You’re ${!availability ? 'un' : ''}available`
  }
}

class MemberAvailability extends React.Component {
  render() {
    const { availability, member, event, open } = this.props
    const className = classNames({
      available: availability,
      unavailable: availability === Event.UNAVAILABLE,
      unknown: availability !== Event.AVAILABLE && availability !== Event.UNAVAILABLE
    })

    return (
      <li className={className} aria-selected={open}>
        <button onClick={() => this.cycle(availability)}>{ICONS.ALL}</button>
        <span className="name">{member.name}</span>
        <Avatar member={member} />
      </li>
    )
  }

  icon(availability) {
    if (availability === Event.AVAILABLE) {
      return ICONS.AVAILABLE
    } else if (availability === Event.UNAVAILABLE) {
      return ICONS.UNAVAILABLE
    } else {
      return ICONS.UNKNOWN
    }
  }

  cycle(availability) {
    this.props.onChange(Event.cycleAvailability(availability))
  }
}

class EventAvailability extends React.Component {
  render() {
    const { availability, event, group, members } = this.props
    return (
      <section className="event-availability" role="tabpanel">
        {this.myAvailability()}
        <ul className="members">
          {sortBy(members, m => m.name.toLocaleLowerCase())
            .map(member => (
              <MemberAvailability
                key={member.id}
                member={member}
                availability={availability[member.id]}
                onChange={value => this.setAvailability(member, value)}
              />
            ))}
        </ul>
      </section>
    )
  }

  myAvailability() {
    const { availability, event, group, members } = this.props
    const member = members[group.memberId]

    if (this.beforeEvent()) {
      return (
        <MyAvailability
          availability={availability[member.id]}
          onChange={value => this.setAvailability(member, value)}
        />
      )
    }
  }

  setAvailability(member, value) {
    const { event, group, members, setAvailability } = this.props
    const current = members[group.memberId]
    if (current.admin || (current.id === member.id && this.beforeEvent())) {
      setAvailability(member, value)
    }
  }

  beforeEvent() {
    return moment().isBefore(this.props.event.startsAt)
  }
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

const mapDispatchToProps = (dispatch, { event }) => ({
  setAvailability: (member, value) => dispatch(availabilityActions.set(event, member, value))
})

export default connect(mapStateToProps, mapDispatchToProps)(EventAvailability)
