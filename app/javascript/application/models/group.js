import { find, forOwn } from 'lodash'
import Member from './member'

class Group {
  constructor(attributes = {}) {
    forOwn(attributes, (value, key) => this[key] = value)
    if (this.url) Event._all[this.url] = this
  }

  set members(values) {
    this._members = values.map(
      attrs => attrs instanceof Member ? attrs : new Member(attrs)
    )
  }

  get members() {
    return this._members
  }

  get currentMember() {
    return find(this.members, ({ id }) => id == this.memberId)
  }
}

export default Group
