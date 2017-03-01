import React from 'react'

export default class CalendarEvent extends React.Component {
  render() {
    const { event } = this.props
    return (
      <li>
        <svg width="39" height="39" viewBox="0 0 39 39">
          <circle cx="19.5" cy="19.5" r="11"/>
          <path className="check" d="M13.5 19.5l4 4 8-8"/>
          <path className="cross" d="M23.5 15.5l-8 8M23.5 23.5l-8-8"/>
          <path className="question" d="M19.5 21.5v-1c1.6 0 3-1.4 3-3s-1.4-3-3-3c-1.2 0-2.3.9-2.8 1.9M19.5 24.5v1"/>
        </svg>
        <a href={`#/events/${event.id}`}>
          <b>{event.name}</b>
          <small>{event.startsAt.format('h:mmA')}</small>
        </a>
      </li>
    )
  }
}
