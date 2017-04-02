import React from 'react'
import classNames from 'classnames'

const Tab = ({ children, name, selected, onSwitch, className }) => (
  <div
    role="tab"
    className={classNames(className)}
    aria-selected={selected === name}
    onClick={() => onSwitch(name)}
  >
    {children}
  </div>
)

const TabList = ({ children, selected, onSwitch }) => (
  <div role="tablist">
    {children.map((tab, key) =>
      React.cloneElement(tab, { selected, key, onSwitch }))}
    <hr />
  </div>
)

export { Tab, TabList }
