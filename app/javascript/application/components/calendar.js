import React from 'react'
import moment from 'moment-timezone'
import classNames from 'classnames'
import InfinitelyScrollable from './infinitely_scrollable'

class Calendar extends React.Component {
  constructor(props) {
    super(props)
    this.onResize = this.onResize.bind(this)
    this.state = {
      now: moment().tz('Pacific/Auckland'),
      months: {},
      min: 0,
      max: 0
    }
    this.loaders = {}
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize)
    this.onResize()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
  }

  render() {
    const { offset, scrollTo } = this.props
    const { height } = this.state
    const className = classNames('calendar', { 'show-bookmark': Math.abs(offset) > height })
    return (
      <div className={className} ref={(el) => this.container = el}>
        {this.content()}
        <button className="bookmark" onClick={() => scrollTo(0)}/>
      </div>
    )
  }

  content() {
    if (this.container) {
      const { offset } = this.props
      return (
        <div className="content" style={this.transform(-offset)}>
          {this.visibleMonths().map(this.renderMonth.bind(this))}
        </div>
      )
    }
  }

  renderMonth(month) {
    return (
      <section key={month.index} className="month" style={this.transform(month.top)}>
        <h3>{month.name}</h3>
      </section>
    )
  }

  visibleMonths() {
    const { offset } = this.props
    const { months, max, height } = this.state
    let results = []
    let index = this.indexAt(offset)
    let month = this.month(index, { top: 0 })
    let y = month.top
    let bottom = offset

    while (bottom < offset + height) {
      month = this.month(index, { top: bottom })
      results.push(month)
      index++
      y += month.height
      bottom = month.top + month.height
    }

    while (results[0].top > offset) {
      let newMonth = this.month(results[0].index - 1, { bottom: results[0].top })
      results.unshift(newMonth)
    }

    return results.filter(month => month.top < offset + height)
  }

  month(index, options) {
    const { months } = this.state
    let month = months[index]

    if (!month) {
      month = this.emptyMonth(index)
      month.top = options.top === undefined ? options.bottom - month.height : options.top
      if (!this.loaders[index]) {
        this.loaders[index] = setTimeout(() => {
          let { months, min, max } = this.state
          months[index] = month
          min = Math.min(index, min)
          max = Math.max(index, max)
          this.setState({ months, min, max })
        })
      }
    }
    return month
  }

  emptyMonth(index) {
    const { now, months } = this.state
    const date = now.clone().startOf('month').add(index, 'months')
    return {
      start: date,
      name: date.format('MMMM YYYY'),
      index: index,
      height: 64
    }
  }

  indexAt(offset) {
    let { min, max, months } = this.state
    while (min < max) {
      let mid = Math.floor((min + max) / 2)
      let month = months[mid]
      if (offset < month.top) {
        min = mid + 1
      } else {
        max = mid - 1
      }
    }
    return min
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
  }
}

Calendar.propTypes = {
  offset: React.PropTypes.number.isRequired
}

Calendar.defaultProps = {
  offset: 0
}

export default InfinitelyScrollable(Calendar)
