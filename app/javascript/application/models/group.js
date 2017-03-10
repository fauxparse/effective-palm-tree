import { find, sortBy } from 'lodash'
import Model from './model'
import Member from './member'

class Group extends Model {
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

  sort() {
    return sortBy(this.members, [member => member.name.toLocaleLowerCase()])
  }
}

export default Group
