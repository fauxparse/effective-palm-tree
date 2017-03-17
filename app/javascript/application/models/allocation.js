import Model from './model'

class Allocation extends Model {
  attributes() {
    return ['id', 'position', 'roleId', 'min', 'max']
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
        return `Any number of`
      } else {
        return `Up to ${this.max}`
      }
    }
  }
}

Allocation.UNLIMITED = null

export default Allocation
