import React from 'react'
import { connect } from 'react-redux'
import { find, flowRight as compose } from 'lodash'
import classNames from 'classnames'
import Stackable from '../../lib/stackable'
import Header from '../header'
import Avatar from '../avatar'

class Member extends React.Component {
  render() {
    const { className, member } = this.props

    return (
      <section className={classNames(className, 'member page')}>
        <Header title={member && member.name} />
        <MemberProfile className="content" member={member} />
      </section>
    )
  }
}

class MemberProfile extends React.Component {
  render() {
    const { className, member = {} } = this.props

    return (
      <section className={classNames(className, 'member-profile')}>
        <header>
          <Avatar member={member} />
        </header>
      </section>
    )
  }
}

const mapStateToProps = ({ members }, { params: { memberId: id } }) => {
  return { member: find(members, ({ slug }) => slug === id) }
}

export default compose(connect(mapStateToProps), Stackable)(Member)
