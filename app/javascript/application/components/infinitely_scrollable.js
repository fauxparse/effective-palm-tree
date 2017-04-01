import React from 'react'

const JITTER_THRESHOLD = 2
const TIME_CONSTANT = 375

export default function InfinitelyScrollable(WrappedComponent) {
  return class InfinitelyScrollableComponent extends React.Component {
    constructor(props) {
      super(props)
      this.state = { offset: 0, dragging: false }

      this.onWheel = this.onWheel.bind(this)
      this.onTouchStart = this.onTouchStart.bind(this)
      this.onTouchMove = this.onTouchMove.bind(this)
      this.onTouchEnd = this.onTouchEnd.bind(this)
      this.trackAutoScroll = this.trackAutoScroll.bind(this)
      this.autoScroll = this.autoScroll.bind(this)
      this.scrollTo = this.scrollTo.bind(this)
    }

    render() {
      return (
        <div
          className="infinitely-scrollable"
          onTouchStart={this.onTouchStart}
          onMouseDown={this.onTouchStart}
          onWheel={this.onWheel}
        >
          <WrappedComponent
            offset={Math.round(this.state.offset)}
            scrollTo={this.scrollTo}
            {...this.props}
          />
        </div>
      )
    }

    onWheel(e) {
      e.stopPropagation()
      this.cancelDrag()
      this.cancelAutoScroll()
      this.setState({
        offset: this.state.offset + e.deltaY * Math.pow(16, e.deltaMode)
      })
    }

    onTouchStart(e) {
      if (e.button) { return }

      let dragging = {
        reference: this.yPosition(e),
        velocity: 0,
        frame: this.state.offset,
        timestamp: Date.now(),
        ticker: setTimeout(this.trackAutoScroll, 100)
      }
      this.setState({ dragging, autoScroll: false })
      window.addEventListener('touchmove', this.onTouchMove)
      window.addEventListener('mousemove', this.onTouchMove)
      window.addEventListener('touchend', this.onTouchEnd)
      window.addEventListener('mouseup', this.onTouchEnd)
    }

    onTouchMove(e) {
      let { dragging, offset } = this.state
      let y = this.yPosition(e)
      let delta = dragging.reference - y
      if (Math.abs(delta) > JITTER_THRESHOLD) {
        offset += delta
        dragging.reference = y
        this.setState({ dragging, offset })
      }
    }

    onTouchEnd(e) {
      let { dragging, offset } = this.state
      let { velocity, ticker } = dragging

      if (ticker) { clearInterval(ticker) }
      if (velocity > 10 || velocity < -10) {
        let amplitude = 0.8 * velocity
        this.setState({
          autoScroll: {
            amplitude,
            target: Math.round(offset + amplitude),
            timestamp: Date.now()
          }
        })
        requestAnimationFrame(this.autoScroll)
      }
      window.removeEventListener('touchmove', this.onTouchMove)
      window.removeEventListener('mousemove', this.onTouchMove)
      window.removeEventListener('touchend', this.onTouchEnd)
      window.removeEventListener('mouseup', this.onTouchEnd)
    }

    yPosition(e) {
      if (e.targetTouches && e.targetTouches.length) { e = e.targetTouches[0] }
      return e.clientY
    }

    trackAutoScroll() {
      let { offset, dragging } = this.state
      if (dragging) {
        let { velocity, timestamp, frame } = dragging

        let now = Date.now()
        let elapsed = now - timestamp
        let delta = offset - frame
        dragging.timestamp = now
        dragging.frame = offset
        dragging.velocity = 0.8 * (1000 * delta / (1 + elapsed)) +
          0.2 * velocity
        dragging.ticker = setTimeout(this.trackAutoScroll, 100)
        this.setState({ offset, dragging })
      }
    }

    autoScroll() {
      let {
        amplitude,
        origin,
        target,
        timestamp,
        duration
      } = this.state.autoScroll || {}

      if (amplitude) {
        this.autoScrollAmplitude(origin, target, timestamp, amplitude)
      } else if (duration) {
        this.autoScrollDuration(origin, target, timestamp, duration)
      }
    }

    autoScrollAmplitude(origin, target, timestamp, amplitude) {
      const elapsed = Date.now() - timestamp
      const delta = -amplitude * Math.exp(-elapsed / TIME_CONSTANT)
      if (delta > 0.5 || delta < -0.5) {
        this.setState({ offset: Math.round(target + delta) })
        requestAnimationFrame(this.autoScroll)
      } else if (target !== undefined) {
        this.setState({ offset: target })
      }
    }

    autoScrollDuration(origin, target, timestamp, duration) {
      const elapsed = Date.now() - timestamp
      this.setState({
        offset: Math.round(
          this.ease(elapsed, origin, target - origin, duration)
        )
      })
      if (elapsed <= duration) { requestAnimationFrame(this.autoScroll) }
    }

    // exponential ease in/out
    // http://gizma.com/easing/
    ease(t, b, c, d) {
      t /= d / 2
      if (t < 1) { return c / 2 * Math.pow(2, 10 * (t - 1)) + b }
      t--
      return c / 2 * (-Math.pow(2, -10 * t) + 2) + b
    }

    cancelDrag() {
      if (this.state.dragging) {
        clearTimeout(this.state.dragging.ticker)
        this.setState({ dragging: false })
      }
    }

    cancelAutoScroll() {
      if (this.state.autoScroll) {
        this.setState({ autoScroll: false })
      }
    }

    scrollTo(target) {
      const { offset } = this.state
      this.cancelDrag()

      this.setState({
        autoScroll: {
          origin: offset,
          target,
          timestamp: Date.now(),
          amplitude: 0,
          duration: Math.sqrt(Math.abs(target - offset)) * 10
        }
      })
      requestAnimationFrame(this.autoScroll)
    }
  }
}
