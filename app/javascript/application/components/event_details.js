import React from 'react'
import history from '../lib/history'
import Header from './header'
import Event from '../models/event'
import CloseButton from './close_button'

export default class EventDetails extends React.Component {
  constructor(props) {
    const { id } = props.params
    super(props)
    this.state = {}
    if (id) this.loadEvent(id)
  }

  render() {
    const { params } = this.props
    const { event } = this.state
    const loading = !event
    return (
      <section className="event-details page">
        <header>
          <CloseButton onClick={this.close.bind(this)}/>
        </header>
      </section>
    )
  }

  close(e) {
    e.preventDefault()
    e.stopPropagation()
    history.push('/events')
  }

  async loadEvent(id) {
    const event = await Event.find(id)
    this.setState({ event })
  }
}
