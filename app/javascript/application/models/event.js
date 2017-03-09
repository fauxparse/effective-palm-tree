import { forOwn } from 'lodash'
import moment from 'moment-timezone'
import fetch from '../lib/fetch'

class Event {
  constructor(attributes = {}) {
    forOwn(attributes, (value, key) => this[key] = value)
    if (this.url) Event._all[this.url] = this
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
}

Event._all = []
Event.AVAILABLE = true
Event.UNAVAILABLE = false
Event.UNKNOWN = null

export default Event
