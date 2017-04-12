import React from 'react'
import { connect } from 'react-redux'
import { pick, sortBy } from 'lodash'
import moment from 'moment-timezone'
import classNames from 'classnames'
import { actions as availabilityActions } from '../../actions/availability'
import Event from '../../models/event'
import Avatar from '../avatar'
import Icon from '../icon'

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
            <Icon name="MY_AVAILABILITY.AVAILABLE" />
          </button>
          <button
            rel="no"
            onClick={() => this.changeAvailability(Event.UNAVAILABLE)}
          >
            <Icon name="MY_AVAILABILITY.UNAVAILABLE" />
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

    return (
      <li className={Event.availableClass(availability)} aria-selected={open}>
        <Avatar member={member} />
        <span className="name">{member.name}</span>
        <button onClick={() => this.cycle(availability)}>
          <Icon name="AVAILABILITY" />
        </button>
      </li>
    )
  }

  cycle(availability) {
    this.props.onChange(Event.cycleAvailability(availability))
  }
}

class EventAvailability extends React.Component {
  render() {
    const { availability, event, group, members } = this.props
    return (
      <section className="event-availability content" role="tabpanel">
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
