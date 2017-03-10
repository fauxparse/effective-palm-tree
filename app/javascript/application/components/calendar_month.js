import React from 'react'
import moment from 'moment-timezone'
import classNames from 'classnames'
import CalendarEvent from './calendar_event'
import Loader from './loader'

export default class CalendarMonth extends React.Component {
  constructor(props) {
    super(props)
    this.changeEventAvailability = this.changeEventAvailability.bind(this)
    this.state = { today: moment().tz(props.timezone) }
  }

  render() {
    const { month, style, timezone, offset, onHeaderClicked } = this.props
    const { loaded } = month
    const floating = Math.max(0, Math.min(month.height - 48, offset - month.top))
    return (
      <section
        className={classNames('month', { loaded })}
        style={style}>
        <h3
          className={classNames({ floating })}
          style={{ top: `${floating}px` }}
          onClick={(e) => onHeaderClicked && onHeaderClicked(e)}>
          {month.start.format('MMMM YYYY')}
        </h3>
        {this.days(month)}
      </section>
    )
  }

  days(month) {
    if (!month.loaded) {
      return <p className="loading"><Loader/><span>Loading…</span></p>
    } else if (month.days.length) {
      return month.days.map(this.day.bind(this))
    } else {
      return (
        <p className="empty">
          <svg width="39" height="39" viewBox="0 0 39 39">
            <circle cx="19.5" cy="19.5" r="11"/>
            <path d="M27.277 11.723 L11.723 27.277"/>
          </svg>
          <span>No events</span>
        </p>
      )
    }
  }

  day(events, key) {
    const date = events[0].startsAt
    const today = date.isSame(this.state.today, 'day')
    return (
      <section key={key}>
        <h4>
          <span className={classNames('date', { today })}>{date.format('DD')}</span>
          <span className="day">{date.format('ddd')}</span>
        </h4>
        <ul>
          {events.map((event, i) => <CalendarEvent key={i} event={event} onChange={this.changeEventAvailability}/>)}
        </ul>
      </section>
    )
  }

  changeEventAvailability(event, member, value) {
    const { month } = this.props
    event.availabilityFor(member, value)
    month.changed()
    this.setState({})
  }
}
