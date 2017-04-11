import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import classNames from 'classnames'

class MenuButton extends React.Component {
  constructor(props) {
    super(props)
    const { location: { pathname = '' } = {} } = props
    this.state = { back: this.backFrom(pathname) }
  }

  componentWillReceiveProps({ location: { pathname } }) {
    const { location: { pathname: existing = '' } = {} } = this.props
    if (pathname !== existing) {
      this.setState({ back: this.backFrom(pathname) })
    }
  }

  backFrom(path = '') {
    return path.replace(/\/[^\/]+\/?$/, '')
  }

  render() {
    const { back } = this.state

    return (
      <button className={classNames('menu-button', { back: back > '/' })} onClick={this.click.bind(this)}>
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path className="top" d="M.5 5.5h22" />
          <path className="middle" d="M.5 12.5h22" />
          <path className="bottom" d="M.5 19.5h22" />
        </svg>
      </button>
    )
  }

  click() {
    const { back } = this.state

    if (back > '/') {
      this.props.go(back)
    } else {
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => ({
  go: (path) => dispatch(push(path))
})

export default connect(mapStateToProps, mapDispatchToProps)(MenuButton)
