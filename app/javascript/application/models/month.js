import { last, sortBy, sum } from 'lodash'
import Event from './event'

export default class Month {
  constructor(date, index = 0) {
    this.index = index
    this.start = date.clone().startOf('month')
    this.loaded = false
    this._events = []

    setTimeout(this.populate.bind(this), 1000)
  }

  get name() {
    if (!this._name) {
      this._name = this.start.format('MMMM YYYY')
    }
    return this._name
  }

  get end() {
    if (!this._end) this._end = this.start.clone().endOf('month')
    return this._end
  }

  set events(events) {
    this._events = sortBy(events, event => event.start.unix())
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

  populate() {
    let tuesdays = this.fillDays(2, 18, 'Family Time').concat(this.fillDays(2, 20.5, 'Burgers'))
    let fridays = this.fillDays(5, 21, 'PlayShop LIVE!')
    this.loaded = true
    this.events = tuesdays.slice(0).concat(fridays)
  }

  fillDays(weekday, hour, name) {
    let results = []
    let d = this.start.clone().startOf('week').add(weekday, 'days').add(hour, 'hours')
    while (d.isBefore(this.start)) d.add(1, 'week')
    while (d.isBefore(this.end)) {
      results.push(new Event({ start: d, name }))
      d = d.clone().add(1, 'week')
    }
    return results
  }
}

function groupEvents(groups, event) {
  if (groups.length && last(groups)[0].start.isSame(event.start, 'day')) {
    last(groups).push(event)
  } else {
    groups.push([event])
  }
  return groups
}
