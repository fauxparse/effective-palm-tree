import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { sortBy } from 'lodash'
import classNames from 'classnames'
import Icon from './icon'
import Avatar from './avatar'
import { actions as userActions } from '../actions/user'

const NavigationItem = ({ icon, active, href, title, children, onClick }) => (
  <li aria-selected={active}>
    <Link to={href || '#'} onClick={onClick}>
      {typeof icon === 'string' ? <Icon name={icon} /> : icon}
      <span className="title">{title}</span>
      {children}
    </Link>
  </li>
)

class Links extends React.Component {
  render() {
    const { groups, members, logOut } = this.props
    return (
      <nav>
        <section>
          <ul>
            <NavigationItem
              icon="SIDEBAR.EVENTS"
              href="/events"
              title="Upcoming events"
            />
          </ul>
        </section>
        <section>
          <h4>Groups</h4>
          <ul>
            {groups.map(group => (
              <NavigationItem
                icon={<Avatar member={members[group.memberId]} />}
                key={group.slug}
                href={`/groups/${group.slug}`}
                title={group.name}
              />
            ))}
            <NavigationItem
              icon="CONTROLS.ADD"
              href="/groups/new"
              title="Create a new group"
            />
          </ul>
        </section>
        <section>
          <ul>
            <NavigationItem icon="SIDEBAR.SETTINGS" title="Settings" />
            <NavigationItem
              icon="SIDEBAR.LOG_OUT"
              title="Log out"
              onClick={logOut}
            />
          </ul>
        </section>
      </nav>
    )
  }
}

const mapStateToProps = ({ groups, members }) => ({
  members,
  groups: sortBy(groups, group => group.name.toLocaleLowerCase())
})

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(userActions.logOut())
})

const Navigation = connect(mapStateToProps, mapDispatchToProps)(Links)

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
        <Navigation />
        <label htmlFor="show-sidebar" className="shim" />
      </aside>
    )
  }
}
