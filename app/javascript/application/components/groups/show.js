import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { flowRight as compose } from 'lodash'
import classNames from 'classnames'
import Stackable from '../../lib/stackable'
import Header from '../header'

class Group extends React.Component {
  render() {
    const { children, className, group } = this.props

    return (
      <section className={classNames(className, 'group page')}>
        <Header title={group && group.name} />
        <Dashboard className="content" group={group} />
        {children}
      </section>
    )
  }
}

class Dashboard extends React.Component {
  render() {
    const { className, group } = this.props

    if (group) {
      return (
        <section className={classNames('group-dashboard', className)}>
          <Link to={`/groups/${group.id}/members`}>Members</Link>
        </section>
      )
    }
  }
}

const mapStateToProps = ({ groups }, { params: { groupId: id } }) => {
  return { group: groups[id] }
}

export default compose(connect(mapStateToProps), Stackable)(Group)
