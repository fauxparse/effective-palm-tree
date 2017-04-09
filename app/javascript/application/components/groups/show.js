import React from 'react'
import { connect } from 'react-redux'
import { flowRight as compose } from 'lodash'
import classNames from 'classnames'
import Stackable from '../../lib/stackable'
import Header from '../header'

class Group extends React.Component {
  render() {
    const { className, group } = this.props

    return (
      <section className={classNames(className, 'group page')}>
        <Header title={group && group.name} />
      </section>
    )
  }
}

const mapStateToProps = ({ groups }, { params: { id } }) => {
  return { group: groups[id] }
}

export default compose(connect(mapStateToProps), Stackable)(Group)
