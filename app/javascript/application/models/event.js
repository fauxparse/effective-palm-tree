import moment from 'moment-timezone'
import fetch from '../lib/fetch'
import Model from './model'

class Event extends Model {
  constructor(attributes = {}) {
    super(attributes)
  }

  clone() {
    return new Event(this.attributeHash())
  }

  attributes() {
    return ['name', 'startsAt', 'endsAt', 'url', 'availability', 'groupId']
  }

  set startsAt(value) {
    this._startsAt = moment(value)
  }

  get startsAt() {
    return this._startsAt
  }

  set endsAt(value) {
    this._endsAt = moment(value)
  }

  get endsAt() {
    return this._endsAt
  }

  set availability(values) {
    this._availability = values
  }

  get availability() {
    return this._availability
  }

  availabilityFor(member, value) {
    const id = member.id || member
    if (arguments.length == 2) {
      this.availability[id] = value
      fetch(this.url + '/availability', {
        method: 'PATCH',
        body: { availability: { [id]: value } }
      })
    }
    return this.availability[id]
  }

  static cycleAvailability(availability) {
    if (availability == Event.AVAILABLE) {
      return Event.UNAVAILABLE
    } else if (availability == Event.UNAVAILABLE) {
      return Event.UNKNOWN
    } else {
      return Event.AVAILABLE
    }
  }
}

Event.AVAILABLE = true
Event.UNAVAILABLE = false
Event.UNKNOWN = null

export default Event
