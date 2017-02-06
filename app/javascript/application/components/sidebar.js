import React from 'react'

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
  render() {
    const { title } = this.props

    return (
      <aside className="sidebar">
        <input type="checkbox" id="show-sidebar"/>
        <PrimaryNavigation/>
        <label htmlFor="show-sidebar" className="shim"/>
      </aside>
    )
  }
}
