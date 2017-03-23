import React from 'react'
import classNames from 'classnames'
import CSSTransitionGroup from 'react-addons-css-transition-group'

const Dialog = ({ children }) => {
  return (
    <div className={classNames('modal-dialog')}>
      {children}
    </div>
  )
}

class Container extends React.Component {
  render() {
    const { children } = this.props
    const open = !!children

    return (
      <CSSTransitionGroup
        component="div"
        className={classNames('modal-container', { open })}
        transitionName="modal"
        transitionEnterTimeout={375}
        transitionLeaveTimeout={375}
      >
        {this.renderChildren(children)}
      </CSSTransitionGroup>
    )
  }

  renderChildren(children) {
    if (children) {
      return Array(children).map((child, i) => (
        <Dialog key={i}>{child}</Dialog>
      ))
    }
  }
}

export default { Dialog, Container }
