import React from 'react'
import { find } from 'lodash'
import classNames from 'classnames'
import Portal from 'react-portal'
import Tether from 'tether'

const CARET = (
  <svg width="24px" height="24px" viewBox="0 0 24 24">
    <path d="M8 10 L12 14 L16 10" transform="translate(0.5, 0.5)" />
  </svg>
)

export default class Select extends React.Component {
  constructor(props) {
    super(props)
    this.state = { open: false }
    this.openPopup = this.openPopup.bind(this)
  }

  render() {
    const { options } = this.props
    const { open } = this.state

    return (
      <div className={classNames('select', { open })}>
        <a
          href="#"
          className="select-trigger"
          ref="trigger"
          onClick={e => this.triggerClicked(e)}
        >
          <span>{this.selectedLabel()}</span>
          {CARET}
        </a>
        <Portal
          ref="portal"
          closeOnEsc
          closeOnOutsideClick
          beforeClose={this.beforeClose.bind(this)}
          onOpen={this.openPopup}
        >
          {this.renderDropdown()}
        </Portal>
      </div>
    )
  }

  selectedLabel() {
    const [selectedId, selectedLabel] = this.selectedOption()
    return selectedLabel
  }

  renderDropdown() {
    const { options, selected } = this.props
    const [selectedId, selectedLabel] = this.selectedOption()
    return (
      <div className="select-options">
        <ul className="list">
          {options.map(([id, label]) => (
            <li key={id} aria-selected={id == selectedId}>
              <a href="#" onClick={e => this.select(e, id)}>{label}</a>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  selectedOption() {
    const { options, selected } = this.props
    return find(options, ([id, _]) => id == selected) || []
  }

  triggerClicked(e) {
    e.preventDefault()
    if (!this.state.open) {
      this.refs.portal.openPortal()
    }
  }

  beforeClose(DOMNode, removeFromDOM) {
    const { tether } = this.state
    const { portal } = this.refs
    const dropdown = portal.portal
    if (tether) tether.destroy()
    dropdown.classList.remove('open')
    setTimeout(removeFromDOM, 300)
    this.setState({ open: false })
  }

  openPopup() {
    const dropdown = this.refs.portal.portal
    this.positionPopup()
    this.setState({ open: true })
    setTimeout(() => dropdown.classList.add('open'))
  }

  positionPopup() {
    const { portal, trigger } = this.refs
    const dropdown = portal.portal
    const list = dropdown.querySelector('.list')
    const selectedItem = dropdown.querySelector('[aria-selected="true"]')

    let offsetY = 0

    if (selectedItem) {
      selectedItem.scrollIntoView()
      offsetY = selectedItem.offsetTop
    }

    const tether = new Tether({
      element: dropdown,
      target: trigger,
      attachment: 'top left',
      targetAttachment: 'top left',
      targetOffset: `-${offsetY}px -16px`,
      constraints: [{ to: 'scrollParent', pin: true }]
    })
    dropdown.style.width = trigger.clientWidth + 32 + 'px'
    list.style.transformOrigin = `50% ${offsetY + trigger.clientHeight / 2}px`
    this.setState({ tether })
  }

  select(e, id) {
    e.preventDefault()
    this.close()
    setTimeout(() => this.props.onChange(id))
  }

  close() {
    this.refs.portal.closePortal()
  }
}
