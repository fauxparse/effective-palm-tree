import Model from './model'

export default class Role extends Model {
  pluralize(n = 2) {
    return (n == 1) ? this.name : this.plural
  }
}
