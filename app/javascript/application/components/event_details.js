import React from 'react'
import history from '../lib/history'
import fetch from '../lib/fetch'
import Header from './header'
import Event from '../models/event'
import CloseButton from './close_button'

class MyAvailability extends React.Component {
  constructor(props) {
    super(props)
    this.state = { availability: undefined }
  }

  render() {
    const { availability } = this.state
    return (
      <div className="my-availability" data-availability={availability}>
        <p className="instructions">Are you available?</p>
        <div className="buttons">
          <button rel="yes" onClick={() => this.setState({ availability: true })}>
            <svg width="32" height="32" viewBox="0 0 32 32">
              <g transform="translate(.5 .5)">
                <circle cx="16" cy="16" r="15"/>
                <path d="M9 17l4 4 10-10"/>
              </g>
            </svg>
          </button>
          <button rel="no" onClick={() => this.setState({ availability: false })}>
            <svg width="32" height="32" viewBox="0 0 32 32">
              <g transform="translate(.5 .5)">
                <circle cx="16" cy="16" r="15"/>
                <path d="M22 10L10 22M22 22L10 10"/>
              </g>
            </svg>
          </button>
        </div>
        <p className="status">
          <span>{this.statusMessage()}</span>
          <button rel="change" onClick={() => this.setState({ availability: undefined })}>Change</button>
        </p>
      </div>
    )
  }

  statusMessage() {
    const { availability } = this.state
    return `You’re ${!availability ? 'un' : ''}available`
  }
}

export default class EventDetails extends React.Component {
  constructor(props) {
    const { group, event, date } = props.params
    super(props)
    this.state = {}
    if (group && event && date) this.loadEvent(group, event, date)
  }

  render() {
    const { params } = this.props
    const { event } = this.state
    const loading = !event
    return (
      <section className="event-details page">
        <header>
          <CloseButton onClick={this.close.bind(this)}/>
          <div>
            <h2>
              <b>{event && event.name}</b>
              <small>{event && event.startsAt.format('dddd D MMMM, YYYY')}</small>
            </h2>
            <ul role="tablist">
              <li role="tab" aria-selected={true}>
                <svg width="24" height="24" viewBox="0 0 24 24"><g transform="translate(.5 .5)"><path d="M9 5l2 2 5-5"/><path d="M10 21.836c0-.604-.265-1.179-.738-1.554C8.539 19.708 7.285 19 5.5 19s-3.039.708-3.762 1.282c-.473.375-.738.95-.738 1.554V23h9v-1.164z"/><circle cx="5.5" cy="13.5" r="2.5"/><path d="M23 21.836c0-.604-.265-1.179-.738-1.554C21.539 19.708 20.285 19 18.5 19s-3.039.708-3.762 1.282c-.473.375-.738.95-.738 1.554V23h9v-1.164z"/><circle cx="18.5" cy="13.5" r="2.5"/></g></svg>
              </li>
            </ul>
          </div>
        </header>
        <section role="tabpanel">
          <MyAvailability/>
        </section>
      </section>
    )
  }

  close(e) {
    e.preventDefault()
    e.stopPropagation()
    history.push('/events')
  }

  async loadEvent(groupId, eventId, date) {
    const url = `/events/${groupId}/${eventId}/${date}`
    fetch(location.pathname)
      .then(response => response.json())
      .then(attrs => this.setState({ event: new Event(attrs) }))
  }
}
