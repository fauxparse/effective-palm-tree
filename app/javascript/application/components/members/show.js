import React from 'react'
import { connect } from 'react-redux'
import { find, flowRight as compose } from 'lodash'
import classNames from 'classnames'
import Stackable from '../../lib/stackable'
import Header from '../header'
import Avatar from '../avatar'
import Invitation from './invitation'

class Member extends React.Component {
  render() {
    const { className, member, group } = this.props

    return (
      <section className={classNames(className, 'member page')}>
        <Header title={member && member.name} />
        <MemberProfile className="content" member={member} group={group} />
      </section>
    )
  }
}

class MemberProfile extends React.Component {
  render() {
    const { className, member = {}, group = {} } = this.props

    return (
      <section className={classNames(className, 'member-profile')}>
        <header>
          <Avatar member={member} />
        </header>
        <Invitation member={member} group={group} />
      </section>
    )
  }
}

const mapStateToProps = (
  { members, groups },
  { params: { groupId, memberId } }
) => {
  const member = find(members, ({ slug }) => slug === memberId)
  const group = groups[groupId]
  return { member, group }
}

export default compose(connect(mapStateToProps), Stackable)(Member)
