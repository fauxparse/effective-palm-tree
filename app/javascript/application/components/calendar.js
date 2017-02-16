import React from 'react'
import InfinitelyScrollable from './infinitely_scrollable'

class Calendar extends React.Component {
  render() {
    const { offset } = this.props
    return (
      <div className="calendar">
        <h2>{offset}</h2>
      </div>
    )
  }
}

Calendar.propTypes = {
  offset: React.PropTypes.number.isRequired
}

Calendar.defaultProps = {
  offset: 0
}

export default InfinitelyScrollable(Calendar)
