import React from 'react'
import Header from './header'
import EventList from './event_list'
import Modal from './modal'

export default class Events extends React.Component {
  render() {
    const { children, params } = this.props
    return (
      <section className="events page">
        <EventList params={params}/>
        <Modal.Container>
          {children && React.cloneElement(children, { key: params.id })}
        </Modal.Container>
      </section>
    )
  }
}
