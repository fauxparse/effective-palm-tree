import { last, sortBy, sum } from 'lodash'

export default class Month {
  constructor(date, index = 0) {
    this.index = index
    this.start = date.clone().startOf('month')
    this.loaded = false
    this._events = []

    setTimeout(this.populate.bind(this), 100)
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
    this._events = sortBy(events, event => event.unix())
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
    return 56 + Math.max(sum(this.days.map(day => day.length * 48)), 32)
  }

  populate() {
    let tuesdays = this.fillDays(2, 18)
    let fridays = this.fillDays(5, 21)
    this.loaded = true
    this.events = tuesdays.slice(0).concat(fridays)
  }

  fillDays(weekday, hour) {
    let results = []
    let d = this.start.clone().startOf('week').add(weekday, 'days').add(hour, 'hours')
    while (d.isBefore(this.start)) d.add(1, 'week')
    while (d.isBefore(this.end)) {
      results.push(d)
      d = d.clone().add(1, 'week')
    }
    return results
  }
}

function groupEvents(groups, event) {
  if (groups.length && last(groups)[0].isSame(event, 'day')) {
    last(groups).push(event)
  } else {
    groups.push([event])
  }
  return groups
}
