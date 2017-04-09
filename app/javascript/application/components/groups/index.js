import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { flowRight as compose, sortBy, values } from 'lodash'
import classNames from 'classnames'
import Stackable from '../../lib/stackable'
import Header from '../header'
import Show from './show'

class Groups extends React.Component {
  render() {
    const { children, className, groups, params } = this.props
    return (
      <section className={classNames(className, 'groups page')}>
        <section className="index page">
          <Header title="Groups" />
          <section>
            <ul>
              {groups.map(group => <Group group={group} key={group.slug} />)}
            </ul>
          </section>
        </section>
        {children}
      </section>
    )
  }
}

const Group = ({ group }) => (
  <li>
    <Link to={`/groups/${group.slug}`}>
      {group.name}
    </Link>
  </li>
)

const mapStateToProps = ({ groups }) => ({
  groups: sortBy(values(groups), ({ name }) => name.toLocaleLowerCase())
})

export default {
  Index: compose(connect(mapStateToProps), Stackable)(Groups),
  Show
}
