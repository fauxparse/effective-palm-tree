import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Icon from './icon'
import { actions as userActions } from '../actions/user'

const NavigationItem = ({ icon, active, children, onClick }) => (
  <li aria-selected={active}>
    <a href="#" onClick={onClick}>
      <Icon name={icon}/>
      <span>{children}</span>
    </a>
  </li>
)

const sidebarActions = dispatch => ({
  logOut: () => dispatch(userActions.logOut())
})

const PrimaryNavigation = connect(undefined, sidebarActions)(props => (
  <nav>
    <ul>
      <NavigationItem icon="SIDEBAR.EVENTS">Events</NavigationItem>
      <NavigationItem icon="SIDEBAR.PEOPLE">People</NavigationItem>
      <NavigationItem icon="SIDEBAR.SETTINGS">Settings</NavigationItem>
      <NavigationItem icon="SIDEBAR.LOG_OUT" onClick={props.logOut}>Log out</NavigationItem>
    </ul>
  </nav>
))

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props)
    this.state = { open: false }
  }

  render() {
    const { title } = this.props
    const { open } = this.state

    return (
      <aside className={classNames('sidebar', { open })}>
        <input
          type="checkbox"
          id="show-sidebar"
          checked={open}
          onChange={e => this.setState({ open: e.target.checked })}
        />
        <PrimaryNavigation />
        <label htmlFor="show-sidebar" className="shim" />
      </aside>
    )
  }
}
