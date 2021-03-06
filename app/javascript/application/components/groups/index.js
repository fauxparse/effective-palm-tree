import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { flowRight as compose, sortBy, values } from 'lodash'
import classNames from 'classnames'
import Stackable from '../../lib/stackable'
import Header from '../header'
import Show from './show'

const Groups = ({ children, className, groups, params }) => (
  <section className={classNames(className, 'groups page')}>
    <Header title="Groups" />
    <section className="content">
      <ul>
        {groups.map(group => <Group group={group} key={group.id} />)}
      </ul>
    </section>
    {children}
  </section>
)

const Group = ({ group }) => (
  <li>
    <Link to={`/groups/${group.id}`}>
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
