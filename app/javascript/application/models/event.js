import { forOwn } from 'lodash'
import moment from 'moment-timezone'

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
}

Event._all = []

export default Event
