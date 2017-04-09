import React from 'react'
import classNames from 'classnames'
import CSSTransitionGroup from 'react-addons-css-transition-group'

const Stackable = WrappedComponent => (ownProps) => {
  const props = { ...ownProps }
  const { children, className, depth } = props
  props.className  = classNames(className, 'stackable', { parent: children })
  return (
    <WrappedComponent {...props}>
      <CSSTransitionGroup
        transitionName="stackable"
        transitionEnterTimeout={375}
        transitionLeaveTimeout={375}
      >
        {children && React.cloneElement(children, { depth: (depth || 0) + 1 })}
      </CSSTransitionGroup>
    </WrappedComponent>
  )
}

export default Stackable
