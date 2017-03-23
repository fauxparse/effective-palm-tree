import React from 'react'

const CloseButton = props => (
  <button rel="close" {...props}>
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path d="M19.5 5.5l-14 14" />
      <path d="M19.5 19.5l-14-14" />
    </svg>
  </button>
)

export default CloseButton
