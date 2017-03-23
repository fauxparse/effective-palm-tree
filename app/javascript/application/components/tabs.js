import React from 'react'

const Tab = ({ children, name, selected, onSwitch }) => (
  <div
    role="tab"
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
