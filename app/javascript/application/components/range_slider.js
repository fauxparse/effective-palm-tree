import React from 'react'

export default class RangeSlider extends React.Component {
  constructor(props) {
    super(props)
    this.state = { positions: [props.min, props.max] }
    this.dragMove = this.dragMove.bind(this)
    this.dragStop = this.dragStop.bind(this)
  }

  componentWillReceiveProps(newProps) {
    const { min, max } = newProps
    const [p1, p2] = this.state.positions
    this.setState({
      positions: p2 < p1 ? [max, min] : [min, max]
    })
  }

  render() {
    const { positions } = this.state
    const [p1, p2] = positions.slice(0).sort()
    return (
      <div className="slider">
        <div className="track" ref="track">
          <div className="selection">
            {positions.map((p, i) => (
              <div
                className="thumb"
                key={i}
                style={{ left: `${p * 100}%` }}
                onMouseDown={e => this.dragStart(i, e)}
                onTouchStart={e => this.dragStart(i, e)}
              />
            ))}
            <hr
              className="range"
              style={{ left: `${p1 * 100}%`, right: `${100 - p2 * 100}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  dragStart(index, e) {
    const dragging = {
      index,
      offset: this.xPosition(e) - e.target.getBoundingClientRect().left,
      thumb: e.target
    }
    const body = document.querySelector('body')

    dragging.thumb.classList.add('pressed')
    this.setState({ dragging })
    body.addEventListener('mousemove', this.dragMove)
    body.addEventListener('touchmove', this.dragMove)
    body.addEventListener('mouseup', this.dragStop)
    body.addEventListener('touchend', this.dragStop)
    this.props.onDragStart()
  }

  dragMove(e) {
    const { dragging, positions } = this.state
    const trackRect = this.refs.track.getBoundingClientRect()
    positions[dragging.index] = Math.max(
      0,
      Math.min(
        1,
        (this.xPosition(e) - trackRect.left - dragging.offset) *
          1.0 /
          trackRect.width
      )
    )
    this.props.onChange(...positions.slice(0).sort())
    this.setState({ positions })
  }

  dragStop(e) {
    e.stopPropagation()
    const { dragging } = this.state
    const body = document.querySelector('body')
    dragging.thumb.classList.remove('pressed')
    body.removeEventListener('mousemove', this.dragMove)
    body.removeEventListener('touchmove', this.dragMove)
    body.removeEventListener('mouseup', this.dragStop)
    body.removeEventListener('touchend', this.dragStop)
    this.setState({ dragging: false })
    this.props.onDragStop()
    setTimeout(() =>
      this.props.onChange(...this.state.positions.slice(0).sort()))
  }

  xPosition(e) {
    if (e.targetTouches && e.targetTouches.length) { e = e.targetTouches[0] }
    return e.clientX
  }
}
