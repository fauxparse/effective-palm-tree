import { forOwn } from 'lodash'

export default class Event {
  constructor(attributes = {}) {
    forOwn(attributes, (value, key) => this[key] = value)
  }
}
