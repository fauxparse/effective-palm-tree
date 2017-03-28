import React from 'react'
import { connect } from 'react-redux'
import history from '../lib/history'
import fetch from '../lib/fetch'
import Header from './header'
import Event from '../models/event'
import CloseButton from './close_button'
import EventAssignments from './event_assignments'
import EventAvailability from './event_availability'
import EventRoles from './event_roles'
import { Tab, TabList } from './tabs'
import { actions as eventActions } from '../actions/events'

// prettier-ignore
const ICONS = {
  ASSIGNMENTS: <svg width="24" height="24" viewBox="0 0 24 24"><g transform="translate(.5 .5)"><path d="M9 5l2 2 5-5"/><path d="M10 21.836c0-.604-.265-1.179-.738-1.554C8.539 19.708 7.285 19 5.5 19s-3.039.708-3.762 1.282c-.473.375-.738.95-.738 1.554V23h9v-1.164z"/><circle cx="5.5" cy="13.5" r="2.5"/><path d="M23 21.836c0-.604-.265-1.179-.738-1.554C21.539 19.708 20.285 19 18.5 19s-3.039.708-3.762 1.282c-.473.375-.738.95-.738 1.554V23h9v-1.164z"/><circle cx="18.5" cy="13.5" r="2.5"/></g></svg>,
  AVAILABILITY: <svg width="24" height="24" viewBox="0 0 24 24"><g transform="translate(.5 .5)"><path d="M6 12l4 4 8-8"/><circle cx="12" cy="12" r="11"/></g></svg>,
  ROLES: <svg width="24" height="24" viewBox="0 0 24 24"><g transform="translate(.5 .5)"><path d="M14 4h9M1 4h3"/><path d="M22 12h1M1 12h11"/><path d="M14 20h9M1 20h3"/><circle cx="7" cy="4" r="3"/><circle cx="15" cy="12" r="3"/><circle cx="7" cy="20" r="3"/></g></svg>
}

class EventDetails extends React.Component {
  constructor(props) {
    const { group, event, date } = props.params
    super(props)
    this.state = { tab: 'assignments' }
    if (group && event && date) this.loadEvent(group, event, date)
  }

  render() {
    const { event, group } = this.props
    const { tab } = this.state
    const loading = !event
    return (
      <section className="event-details page">
        <header>
          <CloseButton onClick={this.close.bind(this)} />
          <div>
            <h2>
              <b>{event && event.name}</b>
              <small>
                {event && event.startsAt.format('dddd D MMMM, YYYY')}
              </small>
            </h2>
            <TabList selected={tab} onSwitch={this.switchTab.bind(this)}>
              <Tab name="assignments">{ICONS.ASSIGNMENTS}</Tab>
              <Tab name="availability">{ICONS.AVAILABILITY}</Tab>
              <Tab name="roles">{ICONS.ROLES}</Tab>
            </TabList>
          </div>
        </header>
        {event && this.contents()}
      </section>
    )
  }

  contents() {
    const { event, group, refreshEvent } = this.props
    const { tab } = this.state
    if (tab == 'assignments') {
      return (
        <EventAssignments
          event={event}
          group={group}
          onChange={refreshEvent}
        />
      )
    } else if (tab == 'availability') {
      return (
        <EventAvailability
          event={event}
          group={group}
          onChange={refreshEvent}
        />
      )
    } else if (tab == 'roles') {
      return (
        <EventRoles
          event={event}
          group={group}
          onChange={refreshEvent}
        />
      )
    }
  }

  switchTab(tab) {
    this.setState({ tab })
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

const mapStateToProps = ({ events, groups }, { location, params }) => {
  return {
    event: events.all[location.pathname],
    group: groups[params.group]
  }
}

const mapDispatchToProps = dispatch => ({
  refreshEvent: event => {
    dispatch(eventActions.refresh(event))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails)
