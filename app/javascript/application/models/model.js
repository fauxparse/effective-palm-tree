import { forOwn } from 'lodash'

export default class Model {
  constructor(attributes = {}) {
    forOwn(attributes, (value, key) => this[key] = value)
  }
}
