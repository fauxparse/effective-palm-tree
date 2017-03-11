import { last, sortBy, sum } from 'lodash'
import fetch from '../lib/fetch'
import Event from './event'

export default class Month {
  constructor(date, index = 0) {
    this.index = index
    this.start = date.clone().startOf('month')
    this.key = this.start.format('YYYY-MM')
    this.loaded = false
    this._events = []
    this.load()
  }

  static getMonth(date, index) {
    const key = date.format('YYYY-MM')
    if (!this._all) this._all = {}
    if (!this._all[key]) {
      this._all[key] = new Month(date, index)
    }
    return this._all[key]
  }

  get name() {
    if (!this._name) {
      this._name = this.start.format('MMMM YYYY')
    }
    return this._name
  }

  get end() {
    if (!this._end) this._end = this.start.clone().add(1, 'month')
    return this._end
  }

  set events(events) {
    this._events = sortBy(events, event => event.startsAt.unix())
    delete this._grouped
    this.changed()
  }

  get events() {
    return this._events
  }

  get days() {
    if (!this._grouped) {
      this._grouped = this.events.reduce(groupEvents, [])
    }
    return this._grouped
  }

  get height() {
    return Math.max(2, this.events.length + 1) * 48
  }

  load() {
    const start = this.start.format('YYYY-MM-DD')
    const stop = this.end.format('YYYY-MM-DD')
    const url = `/events.json?start=${start}&stop=${stop}`

    if (!Month._loaders) Month._loaders = {}
    if (!Month._loaders[url]) Month._loaders[url] = fetch(url).then(response => response.json())
    Month._loaders[url].then(events => this.populate(events))
  }

  populate(events) {
    this.loaded = true
    this.events = events.map(attrs => new Event(attrs))
  }

  changed() {
    if (this.onChange) this.onChange(this)
  }
}
