import React from 'react'
import moment from 'moment-timezone'
import classNames from 'classnames'
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
    if (availability === Event.UNKNOWN) {
      onChange(value)
    } else {
      onChange(Event.UNKNOWN)
    }
  }

  statusMessage() {
    const { availability } = this.props
    return `You’re ${!availability ? 'un' : ''}available`
  }
}

class MemberAvailability extends React.Component {
  render() {
    const { member, event, open } = this.props
    const availability = event.availabilityFor(member)
    const className = classNames({
      available: availability,
      unavailable: availability === Event.UNAVAILABLE,
      unknown: availability == Event.UNKNOWN
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

export default class EventAvailability extends React.Component {
  render() {
    const { event, group } = this.props
    return (
      <section className="event-availability" role="tabpanel">
        {this.myAvailability()}
        <ul className="members">
          {group
            .sort()
            .map(member => (
              <MemberAvailability
                key={member.id}
                member={member}
                event={event}
                onChange={value => this.setAvailability(member, value)}
              />
            ))}
        </ul>
      </section>
    )
  }

  myAvailability() {
    const { event, group } = this.props
    if (this.beforeEvent()) {
      return (
        <MyAvailability
          availability={event.availabilityFor(group.currentMember)}
          onChange={value => this.setAvailability(group.currentMember, value)}
        />
      )
    }
  }

  setAvailability(member, value) {
    const { event, group } = this.props
    const current = group.currentMember
    if (current.admin || (current.id === member.id && this.beforeEvent())) {
      event.availabilityFor(member, value)
      this.props.onChange(event)
    }
  }

  beforeEvent() {
    return moment().isBefore(this.props.event.startsAt)
  }
}
