import React from 'react'
import moment from 'moment-timezone'
import classNames from 'classnames'
import CalendarEvent from './calendar_event'

export default class CalendarMonth extends React.Component {
  constructor(props) {
    super(props)
    this.state = { today: moment().tz(props.timezone) }
  }

  render() {
    const { month, style, timezone, offset } = this.props
    const { loaded } = month
    const floating = Math.max(0, Math.min(month.height - 48, offset - month.top))
    return (
      <section
        className={classNames('month', { loaded })}
        style={style}>
        <h3 className={classNames({ floating })} style={{ top: `${floating}px` }}>
          {month.start.format('MMMM YYYY')}
        </h3>
        {month.days.map(this.day.bind(this))}
      </section>
    )
  }

  day(events, key) {
    const date = events[0].start
    const today = date.isSame(this.state.today, 'day')
    return (
      <section key={key}>
        <h4>
          <span className={classNames('date', { today })}>{date.format('DD')}</span>
          <span className="day">{date.format('ddd')}</span>
        </h4>
        <ul>
          {events.map((event, i) => <CalendarEvent key={i} event={event}/>)}
        </ul>
      </section>
    )
  }
}
