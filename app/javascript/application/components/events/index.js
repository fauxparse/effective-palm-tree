import React from 'react'
import { flowRight as compose } from 'lodash'
import Header from '../header'
import Calendar from './calendar'
import classNames from 'classnames'
import Stackable from '../../lib/stackable'
import Show from './show'

const Events = ({ children, className, params }) => (
  <section className={classNames('events page', className)}>
    <Header title="Events" />
    <Calendar params={params} />
    {children}
  </section>
)

export default {
  Index: compose(Stackable)(Events),
  Show
}
