import React from 'react'
import { last, sortBy } from 'lodash'
import moment from 'moment-timezone'
import classNames from 'classnames'
import CalendarEvent from './calendar_event'
import Loader from './loader'
import { actions as eventActions } from '../actions/events'

class CalendarMonth extends React.Component {
  constructor(props) {
    super(props)
    this.state = { today: moment().tz(props.timezone) }
  }

  render() {
    const { loading, style, start, headerOffset, onHeaderClicked } = this.props
    return (
      <section className={classNames('month', { loading })} style={style}>
        <h3
          className={classNames({ floating: headerOffset })}
          style={{ top: `${headerOffset}px` }}
          onClick={e => onHeaderClicked && onHeaderClicked(e)}
        >
          {start.format('MMMM YYYY')}
        </h3>
        {this.days()}
      </section>
    )
  }

  days() {
    const { loading, events } = this.props
    if (loading) {
      return <p className="loading"><Loader /><span>Loading…</span></p>
    } else if (events.length) {
      const days = sortBy(events, e => e.startsAt.unix).reduce(groupEvents, [])
      return days.map(this.day.bind(this))
    } else {
      return (
        <p className="empty">
          <svg width="39" height="39" viewBox="0 0 39 39">
            <circle cx="19.5" cy="19.5" r="11" />
            <path d="M27.277 11.723 L11.723 27.277" />
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
          <span className={classNames('date', { today })}>
            {date.format('DD')}
          </span>
          <span className="day">{date.format('ddd')}</span>
        </h4>
        <ul>
          {events.map((event, i) => <CalendarEvent key={i} event={event} />)}
        </ul>
      </section>
    )
  }
}

function groupEvents(groups, event) {
  if (groups.length && last(groups)[0].startsAt.isSame(event.startsAt, 'day')) {
    last(groups).push(event)
  } else {
    groups.push([event])
  }
  return groups
}

export default CalendarMonth
