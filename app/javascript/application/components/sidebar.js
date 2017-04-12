import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { sortBy } from 'lodash'
import classNames from 'classnames'
import Icon from './icon'
import Avatar from './avatar'
import { actions as userActions } from '../actions/user'
import { actions as sidebarActions } from '../actions/sidebar'

const NavigationItem = ({ icon, active, href, title, children, onClick }) => (
  <li aria-selected={active}>
    <Link to={href || '#'} onClick={onClick}>
      {typeof icon === 'string' ? <Icon name={icon} /> : icon}
      <span className="title">{title}</span>
      {children}
    </Link>
  </li>
)

class Navigation extends React.Component {
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
                key={group.id}
                href={`/groups/${group.id}`}
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

class Sidebar extends React.Component {
  render() {
    const { groups, members, open, hide, logOut } = this.props

    return (
      <aside className={classNames('sidebar', { open })}>
        <Navigation groups={groups} members={members} logOut={logOut} />
        <div className="shim" onClick={hide} />
      </aside>
    )
  }
}

const mapStateToProps = ({ groups, members, sidebar }) => ({
  open: sidebar,
  members,
  groups: sortBy(groups, group => group.name.toLocaleLowerCase())
})

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(userActions.logOut()),
  hide: () => dispatch(sidebarActions.hide())
})

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
