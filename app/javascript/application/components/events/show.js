import React from 'react'
import { connect } from 'react-redux'
import { flowRight as compose, pick } from 'lodash'
import classNames from 'classnames'
import Stackable from '../../lib/stackable'
import Header from '../header'
import Event from '../../models/event'
import EventAssignments from './assignments'
import EventAvailability from './availability'
import EventRoles from './roles'
import { Tab, TabList } from '../tabs'
import Icon from '../icon'
import { query } from '../../lib/reactive_query'
import { constants as ENTITIES } from '../../actions/entities'
import { event as eventSchema } from '../../schema'

class EventDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = { tab: 'assignments' }
  }

  componentDidMount() {
    this.props.loadEvent()
  }

  render() {
    const { className, event, group, availability } = this.props
    const { tab } = this.state
    const loading = !event
    return (
      <section className={classNames('event-details page', className)}>
        <header>
          <div>
            <h2>
              <b>{event && event.name}</b>
              <small>
                {event && event.startsAt.format('dddd D MMMM, YYYY')}
              </small>
            </h2>
            <TabList selected={tab} onSwitch={this.switchTab.bind(this)}>
              <Tab name="assignments"><Icon name="TABS.ASSIGNMENTS"/></Tab>
              <Tab name="availability" className={Event.availableClass(availability)}><Icon name="AVAILABILITY"/></Tab>
              <Tab name="roles"><Icon name="TABS.ROLES"/></Tab>
            </TabList>
          </div>
        </header>
        {event && this.contents()}
      </section>
    )
  }

  contents() {
    const { event, group, members, roles } = this.props
    const { tab } = this.state
    if (tab === 'assignments') {
      return <EventAssignments event={event} />
    } else if (tab === 'availability') {
      return <EventAvailability event={event} />
    } else if (tab === 'roles') {
      return <EventRoles event={event} />
    }
  }

  switchTab(tab) {
    this.setState({ tab })
  }
}

const mapStateToProps = ({ groups, events, members, roles, availability }, { location, params }) => {
  const group = groups[params.group]
  const event = events[location.pathname]
  return {
    event,
    group,
    members: pick(members, group.members),
    roles: pick(roles, group.roles),
    availability: group && event && availability[event.url][group.memberId]
  }
}

const mapDispatchToProps = (dispatch, { params: { group, event, date } }) => ({
  loadEvent: () => dispatch(query(
    `/events/${group}/${event}/${date}`,
    { schema: eventSchema }
  ))
})

export default compose(connect(mapStateToProps, mapDispatchToProps), Stackable)(EventDetails)
