import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import classNames from 'classnames'
import { actions as sidebarActions } from '../actions/sidebar'

class MenuButton extends React.Component {
  constructor(props) {
    super(props)
    const { location: { pathname = '' } = {}, routes = [] } = props
    this.state = { back: this.backFrom(pathname, routes) }
  }

  componentWillReceiveProps({ location: { pathname }, routes = [] }) {
    const { location: { pathname: existing = '' } = {} } = this.props
    if (pathname !== existing) {
      this.setState({ back: this.backFrom(pathname, routes) })
    }
  }

  backFrom(path = '', routes = []) {
    const parts = path.replace(/^\//, '').split('/')
    const routeParts = routes.slice(1, -1).map(({ path }) => path)
    const howMany = routeParts.length && routeParts.join('/').split('/').length
    return '/' + parts.slice(0, howMany).join('/')
  }

  render() {
    const { back } = this.state

    return (
      <button
        className={classNames('menu-button', { back: back > '/' })}
        onClick={this.click.bind(this)}
      >
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
    const { go, showSidebar } = this.props

    if (back > '/') {
      go(back)
    } else {
      showSidebar()
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = dispatch => ({
  go: path => dispatch(push(path)),
  showSidebar: () => dispatch(sidebarActions.show())
})

export default connect(mapStateToProps, mapDispatchToProps)(MenuButton)
