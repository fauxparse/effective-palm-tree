import React from 'react'
import Header from './header'
import EventList from './event_list'

export default class Events extends React.Component {
  render() {
    const { children, params } = this.props
    return (
      <section className="events page">
        <EventList params={params}>
          {children}
        </EventList>
      </section>
    )
  }
}
