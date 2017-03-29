import { assign, findIndex, some } from 'lodash'
import Model from './model'

class Allocation extends Model {
  attributes() {
    return ['id', 'position', 'roleId', 'min', 'max', 'assignments']
  }

  clone() {
    return new Allocation(this.attributeHash())
  }

  countString() {
    if (this.min == this.max) {
      return this.min
    } else if (this.min) {
      if (this.max == Allocation.UNLIMITED) {
        return `${this.min} or more`
      } else {
        return `${this.min} to ${this.max}`
      }
    } else {
      if (this.max == Allocation.UNLIMITED) {
        return `Some`
      } else {
        return `Up to ${this.max}`
      }
    }
  }

  isAssigned(member) {
    member = member.id || member
    return some(this.assignments, a => a.memberId == member)
  }

  remove(member) {
    member = member.id || member
    const index = findIndex(this.assignments, a => a.memberId == member)
    if (index > -1) this.assignments.splice(index, 1)
  }

  add(member) {
    if (!this.isAssigned(member)) {
      this.assignments.push({ memberId: member.id || member, allocation: this })
    }
  }

  set assignments(values) {
    this._assignments = values.map(a => assign(a, { allocation: this }))
  }

  get assignments() {
    return this._assignments
  }
}

Allocation.UNLIMITED = null

export default Allocation
