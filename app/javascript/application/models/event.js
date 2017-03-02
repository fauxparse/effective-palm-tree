import { forOwn } from 'lodash'
import moment from 'moment-timezone'

class Event {
  constructor(attributes = {}) {
    this.id = attributes.id || Event._id++
    forOwn(attributes, (value, key) => this[key] = value)
    Event._all[this.id] = this
  }

  static async find(id) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(Event._all[id])
      }, 1000)
    })
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

Event._id = 1
Event._all = []

export default Event
