import { last, sortBy, sum } from 'lodash'
import fetch from '../lib/fetch'
import Event from './event'

export default class Month {
  constructor(date, index = 0) {
    this.index = index
    this.start = date.clone().startOf('month')
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
    if (this.onChange) this.onChange(this)
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
    return 48 + Math.max(sum(this.days.map(day => day.length * 48)), 48)
  }

  load() {
    const start = this.start.format('YYYY-MM-DD')
    const stop = this.end.format('YYYY-MM-DD')
    const url = `/events.json?start=${start}&stop=${stop}`
    fetch(url)
      .then(response => response.json())
      .then(events => this.populate(events))
  }

  populate(events) {
    this.loaded = true
    this.events = events.map(attrs => new Event(attrs))
  }
}

function groupEvents(groups, event) {
  if (groups.length && last(groups)[0].startsAt.isSame(event.startsAt, 'day')) {
    last(groups).push(event)
  } else {
    groups.push([event])
  }
  return groups
}
