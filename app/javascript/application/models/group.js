import { find, sortBy } from 'lodash'
import Model from './model'
import Member from './member'
import Role from './role'

class Group extends Model {
  set members(values) {
    this._members = values.map(
      attrs => attrs instanceof Member ? attrs : new Member(attrs)
    )
  }

  get members() {
    if (!this._members) this._members = []
    return this._members || []
  }

  member(id) {
    return find(this.members, member => id == member.id)
  }

  set roles(values) {
    this._roles = sortBy(
      values.map(attrs => attrs instanceof Role ? attrs : new Role(attrs)),
      r => r.name.toLocaleLowerCase()
    )
  }

  get roles() {
    if (!this._roles) this._roles = []
    return this._roles || []
  }

  role(id) {
    return find(this.roles, role => id == role.id)
  }

  get currentMember() {
    return find(this.members, ({ id }) => id == this.memberId)
  }

  sort() {
    return sortBy(this.members, [member => member.name.toLocaleLowerCase()])
  }
}

export default Group
