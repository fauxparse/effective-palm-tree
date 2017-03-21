import { assign, forOwn } from 'lodash'

export default class Model {
  constructor(attributes = {}) {
    this.update(attributes)
  }

  attributes() {
    return []
  }

  attributeHash() {
    return this.attributes().reduce((h, a) => assign(h, { [a]: this[a] }), {})
  }

  update(attributes = {}) {
    forOwn(attributes, (value, key) => this[key] = value)
    return this
  }
}
