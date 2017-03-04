import React from 'react'
import Header from './header'
import Calendar from './calendar'

export default class EventList extends React.Component {
  render() {
    const { children, params } = this.props
    return (
      <section className="event-list page">
        <Header title="Events"/>
        <Calendar params={params}>
          {children}
        </Calendar>
      </section>
    )
  }
}
