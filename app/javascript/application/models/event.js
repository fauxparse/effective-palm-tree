import { forOwn } from 'lodash'
import moment from 'moment-timezone'

let id = 1

export default class Event {
  constructor(attributes = {}) {
    this.id = id++
    forOwn(attributes, (value, key) => this[key] = value)
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
