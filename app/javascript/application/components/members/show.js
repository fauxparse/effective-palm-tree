import React from 'react'
import { connect } from 'react-redux'
import { flowRight as compose } from 'lodash'
import classNames from 'classnames'
import Stackable from '../../lib/stackable'
import Header from '../header'

class Member extends React.Component {
  render() {
    const { className, member } = this.props

    return (
      <section className={classNames(className, 'member page')}>
        <Header title={member && member.name} />
      </section>
    )
  }
}

const mapStateToProps = ({ members }, { params: { memberId: id } }) => {
  return { member: members[id] }
}

export default compose(connect(mapStateToProps), Stackable)(Member)
