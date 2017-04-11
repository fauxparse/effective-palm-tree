import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { flowRight as compose, pick, sortBy, values } from 'lodash'
import classNames from 'classnames'
import Stackable from '../../lib/stackable'
import Header from '../header'
import Avatar from '../avatar'
import Show from './show'

class Members extends React.Component {
  render() {
    const { children, className, group, members, params } = this.props
    return (
      <section className={classNames(className, 'members page')}>
        <section className="index page">
          <Header title="Members" />
          <section className="member-list">
            <ul>
              {members.map(member => (
                <Member group={group} member={member} key={member.id} />
              ))}
            </ul>
          </section>
        </section>
        {children}
      </section>
    )
  }
}

const Member = ({ group, member }) => (
  <li>
    <Link to={`/groups/${group.id}/members/${member.slug}`}>
      <Avatar member={member} />
      <span className="name">
        {member.name}
      </span>
    </Link>
  </li>
)

const mapStateToProps = ({ groups, members }, { params: { groupId } }) => {
  const group = groups[groupId] || {}
  const groupMembers = pick(members, group.members || [])
  return {
    group,
    members: sortBy(values(groupMembers), ({ name }) =>
      name.toLocaleLowerCase())
  }
}

export default {
  Index: compose(connect(mapStateToProps), Stackable)(Members),
  Show
}
