import { assign, forOwn } from 'lodash'

export default class Model {
  constructor(attributes = {}) {
    forOwn(attributes, (value, key) => this[key] = value)
  }

  attributes() {
    return []
  }

  attributeHash() {
    return this.attributes().reduce((h, a) => assign(h, { [a]: this[a] }), {})
  }
}
