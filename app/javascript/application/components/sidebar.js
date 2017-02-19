import React from 'react'
import classNames from 'classnames'

const NavigationItem = ({ active, children }) => (
  <li aria-selected={active}>
    <a href="#">
      <span>{children}</span>
    </a>
  </li>
)

const PrimaryNavigation = () => (
  <nav>
    <ul>
      <NavigationItem active="true">Events</NavigationItem>
      <NavigationItem>People</NavigationItem>
      <NavigationItem>Settings</NavigationItem>
      <NavigationItem>Log out</NavigationItem>
    </ul>
  </nav>
)

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
        <input type="checkbox" id="show-sidebar" checked={open}
          onChange={e => this.setState({ open: e.target.checked })}/>
        <PrimaryNavigation/>
        <label htmlFor="show-sidebar" className="shim"/>
      </aside>
    )
  }
}
