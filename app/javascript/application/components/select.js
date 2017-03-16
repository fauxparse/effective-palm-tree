import React from 'react'
import { find } from 'lodash'
import Portal from 'react-portal'
import Tether from 'tether'

export default class Select extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.positionPopup = this.positionPopup.bind(this)
  }

  render() {
    const { options } = this.props
    const [selectedId, selectedLabel] = this.selectedOption()

    return (
      <div className="select">
        <a href="#" className="select-trigger" ref="trigger" onClick={(e) => this.triggerClicked(e)}>
          <span>{selectedLabel}</span>
        </a>
        <Portal
          ref="portal"
          closeOnEsc
          closeOnOutsideClick
          beforeClose={this.beforeClose.bind(this)}
          onOpen={this.positionPopup}>
          <div className="select-options">
            <ul>
              {options.map(
                ([id, label]) =>
                  <li key={id} aria-selected={id == selectedId}>
                    <a href="#" onClick={(e) => this.select(e, id)}>{label}</a>
                  </li>
              )}
            </ul>
          </div>
        </Portal>
      </div>
    )
  }

  selectedOption() {
    const { options, selected } = this.props
    return find(options, ([id, _]) => id == selected) || []
  }

  triggerClicked(e) {
    e.preventDefault()
    this.refs.portal.openPortal()
  }

  beforeClose(DOMNode, removeFromDOM) {
    const { tether } = this.state
    const { portal } = this.refs
    const dropdown = portal.portal
    if (tether) tether.destroy()
    dropdown.classList.remove('open')
    setTimeout(removeFromDOM, 300)
  }

  positionPopup() {
    const { portal, trigger } = this.refs
    const dropdown = portal.portal
    const list = dropdown.querySelector('ul')
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
    dropdown.style.width = (trigger.clientWidth + 32) + 'px'
    list.style.transformOrigin = `50% ${offsetY + trigger.clientHeight / 2}px`
    this.setState({ tether })
    setTimeout(() => dropdown.classList.add('open'))
  }

  select(e, id) {
    e.preventDefault()
    this.refs.portal.closePortal()
    setTimeout(() => this.props.onChange(id))
  }
}
