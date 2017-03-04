import React from 'react'
import moment from 'moment-timezone'
import classNames from 'classnames'
import { sortBy } from 'lodash'
import InfinitelyScrollable from './infinitely_scrollable'
import Month from '../models/month'
import Event from '../models/event'
import CalendarMonth from './calendar_month'
import Modal from './modal'

class Calendar extends React.Component {
  constructor(props) {
    super(props)
    this.fillMonths = this.fillMonths.bind(this)
    this.onResize = this.onResize.bind(this)
    this.state = {
      now: moment().tz(this.props.timezone),
      months: {},
      min: 0,
      max: 0
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize)
    requestAnimationFrame(this.onResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.offset) {
      requestAnimationFrame(() => this.fillMonths(nextProps.offset))
    }
  }

  render() {
    const { offset, scrollTo, children, params } = this.props
    const { height } = this.state
    const className = classNames('calendar', { 'show-bookmark': Math.abs(offset) > height })
    return (
      <div className={className} ref={(el) => this.container = el}>
        {this.timeline()}
        <button className="bookmark" onClick={() => scrollTo(-1)}/>
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

  renderMonth(month) {
    return (
      <CalendarMonth
        key={month.index}
        month={month}
        timezone={this.props.timezone}
        style={this.transform(month.top)}
        offset={this.props.offset}
        onHeaderClicked={() => this.props.scrollTo(month.top - 1)}
      />
    )
  }

  visibleMonths() {
    const { offset } = this.props
    const { months, height } = this.state
    let results = []

    let index = this.indexAt(offset)
    let month = months[index]
    let y = month ? month.top : 0

    while ((month = months[index]) && y < offset + height) {
      results.push(month)
      index++
      y += month.height
    }

    return results
  }

  fillMonths(offset) {
    let { months, min, max, height } = this.state
    let windowStart = offset - height
    let windowEnd = offset + height * 2
    let start = this.indexAt(windowStart)
    let month = this.month(start, { top: 0 })
    let top = month.top
    let bottom = top + month.height
    let index = start

    while (bottom < windowEnd) {
      months[index++] = month
      bottom = month.top + month.height
      month = this.month(index, { top: bottom })
      max = index
    }

    index = start
    while (top > windowStart) {
      index -= 1
      month = months[index] = this.month(index, { bottom: top })
      top = month.top
      min = index
    }

    this.setState({ months, min, max })
  }

  month(index, options) {
    const { now, months } = this.state
    let month = months[index]

    if (!month) {
      const date = now.clone().startOf('month').add(index, 'months')
      month = Month.getMonth(date, index)
      month.top = options.top === undefined ? options.bottom - month.height : options.top
      month.onChange = () => this.refreshOffsetsFrom(index)
    }
    return month
  }

  indexAt(offset) {
    let { min, max, months } = this.state
    while (min < max) {
      let mid = Math.floor((min + max) / 2)
      let month = months[mid]
      if (!month || (month.top <= offset && offset < month.top + month.height)) {
        return mid;
      } else if (offset < month.top) {
        max = mid - 1
      } else {
        min = mid + 1
      }
    }
    return min
  }

  refreshOffsetsFrom(index) {
    const { months } = this.state

    if (index >= 0) {
      if (months[index]) {
        for (let y = months[index].top; months[index]; y += months[index++].height) {
          months[index].top = y
        }
      }
    } else {
      if (months[index + 1]) {
        for (let y = months[index + 1].top; months[index]; index--) {
          y = months[index].top = y - months[index].height
        }
      }
    }
    this.setState({ months })
  }

  isVisibleAt(offset, month) {
    const bottom = month.top + month.height
    return offset >= top && offset < bottom
  }

  transform(y) {
    return { transform: `translateY(${y}px)` }
  }

  onResize() {
    this.setState({ height: this.container.clientHeight })
    this.fillMonths(this.state.offset || 0)
  }
}

Calendar.propTypes = {
  offset: React.PropTypes.number.isRequired,
  timezone: React.PropTypes.string.isRequired
}

Calendar.defaultProps = {
  offset: 0,
  timezone: 'Pacific/Auckland'
}

export default InfinitelyScrollable(Calendar)
