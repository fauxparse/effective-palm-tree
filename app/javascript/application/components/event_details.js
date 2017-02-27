import React from 'react'
import Header from './header'

export default class EventDetails extends React.Component {
  render() {
    const { params } = this.props
    return (
      <section className="event-details page">
        <Header title={params.id}/>
      </section>
    )
  }
}
