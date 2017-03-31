import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment-timezone'
import classNames from 'classnames'
import { keyBy, keys, sortBy, values } from 'lodash'
import { query } from '../lib/reactive_query'
import InfinitelyScrollable from './infinitely_scrollable'
import Event from '../models/event'
import CalendarMonth from './calendar_month'
import Modal from './modal'
import { constants as ENTITIES } from '../actions/entities'
import { event as eventSchema } from '../schema'

class Calendar extends React.Component {
  constructor(props) {
    super(props)
    this.fillMonths = this.fillMonths.bind(this)
    this.onResize = this.onResize.bind(this)
    this.state = { height: 0 }
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize)
    setTimeout(this.onResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.offset) {
      this.fillMonths(nextProps.offset)
    }
  }

  render() {
    const { offset, scrollTo, children, params } = this.props
    const { height } = this.state
    const className = classNames('calendar', {
      'show-bookmark': Math.abs(offset) > height
    })
    return (
      <div
        className={className}
        ref={el => {
          this.container = el
        }}
      >
        {this.timeline()}
        <button className="bookmark" onClick={() => scrollTo(-1)} />
        <Modal.Container>
          {children && React.cloneElement(children, { key: params.id })}
        </Modal.Container>
      </div>
    )
  }

  timeline() {
    if (this.container) {
      const { offset } = this.props
      return (
        <div className="timeline" style={this.transform(-offset)}>
          {this.visibleMonths().map(this.renderMonth.bind(this))}
        </div>
      )
    }
  }

  renderMonth(index) {
    const {
      now,
      months,
      offset,
      timezone,
      scrollTo
    } = this.props
    const month = months[index] || { loading: true }
    const events = this.eventsByMonth(index)
    const top = this.calculateOffset(index)
    const height = monthHeight({ events })
    return (
      <CalendarMonth
        key={index}
        loading={!events.length && month.loading}
        events={events}
        start={month.start || now.clone().add(index, 'months')}
        style={{ top }}
        headerOffset={Math.max(0, Math.min(height - 48, offset - top))}
        onHeaderClicked={() => scrollTo(this.calculateOffset(index) - 1)}
      />
    )
  }

  calculateOffset(index) {
    const { months, offsets } = this.props
    if (offsets[index] !== undefined) {
      return offsets[index]
    } else if (index === 0) {
      return 0
    } else if (index < 0) {
      return this.calculateOffset(index + 1) - monthHeight(months[index])
    } else {
      return this.calculateOffset(index - 1) + monthHeight(months[index - 1])
    }
  }

  eventsByMonth(index) {
    const { now, events, months } = this.props
    const month = months[index]
    return month ? month.events.map(url => events[url]) : []
  }

  visibleMonths() {
    const { offset, months, min, max, offsets, heights } = this.props
    const { height } = this.state
    let results = []

    let index = this.indexAt(offset)
    let y = this.calculateOffset(index)
    while (y < offset + height) {
      results.push(index)
      y += monthHeight(months[index])
      index++
    }

    index = Math.min(0, results[0] || 0) - 1
    while (this.calculateOffset(index) + monthHeight(months[index]) > offset) {
      results.unshift(index)
      index--
    }

    return results
  }

  fetchMonths(indices) {
    const { now, fetch, months } = this.props
    indices = indices.filter(i => !months[i])
    if (indices.length) {
      const start = this.monthStart(indices[0])
      const stop = this.monthStart(indices[indices.length - 1] + 1)
      fetch(start, stop, indices[0])
    }
  }

  monthStart(index) {
    const { now } = this.props
    return now.clone().startOf('month').add(index, 'months')
  }

  fillMonths(offset) {
    const { now, fetch, months } = this.props
    let { height } = this.state
    let windowStart = offset - height
    let windowEnd = offset + height * 2
    let index = this.indexAt(windowStart)
    let top = this.calculateOffset(index)

    let toFetch = []

    while (top < windowEnd) {
      if (!months[index]) toFetch.push(index)
      top += monthHeight(months[index])
      index++
    }

    index = (top = 0)
    while (top > windowStart) {
      if (!months[index]) toFetch.unshift(index)
      index--
      top -= monthHeight(months[index])
    }

    if (toFetch.length) {
      setTimeout(() => this.fetchMonths(toFetch))
    }
  }

  indexAt(offset) {
    let { min, max, months, offsets } = this.props
    while (min < max) {
      let mid = Math.floor((min + max) / 2)
      let top = offsets[mid]
      if (!top) {
        return mid
      } else if (top <= offset && offset < top + monthHeight(months[mid])) {
        return mid
      } else if (offset < top) {
        max = mid - 1
      } else {
        min = mid + 1
      }
    }
    return min
  }

  transform(y) {
    return { transform: `translateY(${y}px)` }
  }

  onResize() {
    this.setState({ height: this.container.clientHeight })
    this.fillMonths(this.props.offset)
  }
}

Calendar.propTypes = {
  offset: React.PropTypes.number.isRequired,
  timezone: React.PropTypes.string.isRequired
}

Calendar.defaultProps = {
  offset: 0,
  now: moment(),
  timezone: 'Pacific/Auckland'
}

function calculateOffsets(months) {
  const indexed = keyBy(values(months), m => m.index)
  const indices = keys(indexed).map(k => parseInt(k, 10)).sort()
  const min = indices[0] || 0
  const max = indices[indices.length - 1] || 0
  const offsets = {}
  const heights = {}
  for (let i = 0, y = 0; i <= max; i++) {
    offsets[i] = y
    y += (heights[i] = monthHeight(indexed[i]))
  }
  for (let i = -1, y = 0; i >= min; i--) {
    y = (offsets[i] = y - (heights[i] = monthHeight(indexed[i])))
  }
  return { min, max, heights, offsets, months: indexed }
}

const monthHeight = (month) =>
  Math.max(2, (month && month.events || []).length + 1) * 48

const fetchMonths = (start, stop, startIndex) =>
  query('/events', {
    schema: [eventSchema], params: { start, stop, startIndex }
  })

const mapStateToProps = ({ events, calendar }, { now }) =>
  ({ events, ...calculateOffsets(calendar, now) })

const mapDispatchToProps = dispatch => ({
  fetch: (start, stop, index) => dispatch(fetchMonths(start, stop, index))
})

export default InfinitelyScrollable(
  connect(mapStateToProps, mapDispatchToProps)(Calendar)
)
