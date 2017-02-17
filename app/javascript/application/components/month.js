import React from 'react'
import classNames from 'classnames'

export default class Month extends React.Component {
  render() {
    const { date, dates, style, loaded } = this.props
    return (
      <section className={classNames('month', { loaded })} style={style}>
        <h3>{date.format('MMMM YYYY')}</h3>
        {dates.map(date => this.renderDay(date))}
      </section>
    )
  }

  contents() {
    const { dates } = this.props
  }

  renderDay(date) {
    return (
      <section key={date}>
        <h4>
          <span className="date">{date.format('DD')}</span>
          <span className="day">{date.format('ddd')}</span>
        </h4>
        <ul>
          <li>
            <svg width="39" height="39" viewBox="0 0 39 39">
              <circle cx="19.5" cy="19.5" r="11"/>
              <path className="check" d="M13.5 19.5l4 4 8-8"/>
              <path className="cross" d="M23.5 15.5l-8 8M23.5 23.5l-8-8"/>
              <path className="question" d="M19.5 21.5v-1c1.6 0 3-1.4 3-3s-1.4-3-3-3c-1.2 0-2.3.9-2.8 1.9M19.5 24.5v1"/>
            </svg>
            <a href="#">
              <b>PlayShop LIVE!</b>
              <small>9:00PM</small>
            </a>
          </li>
        </ul>
      </section>
    )
  }
}
