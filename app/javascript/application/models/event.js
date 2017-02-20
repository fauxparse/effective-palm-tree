import { forOwn } from 'lodash'

let id = 1

export default class Event {
  constructor(attributes = {}) {
    this.id = id++
    forOwn(attributes, (value, key) => this[key] = value)
  }
}
