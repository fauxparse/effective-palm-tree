import { forOwn } from 'lodash'

export default class Member {
  constructor(attributes = {}) {
    forOwn(attributes, (value, key) => this[key] = value)
    if (this.url) Event._all[this.url] = this
  }
}
