import Model from './model'

export default class Member extends Model {
  attributes() {
    return ['name', 'admin', 'avatarUrl']
  }

  set avatarUrl(value) {
    this._avatarUrl = value
  }

  get avatarUrl() {
    return this._avatarUrl
  }
}
