import React from 'react'

export default class Header extends React.Component {
  render() {
    const { title } = this.props

    return (
      <header>
        <label htmlFor="show-sidebar">
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path className="top" d="M.5 5.5h22"/>
            <path className="middle" d="M.5 12.5h22"/>
            <path className="bottom" d="M.5 19.5h22"/>
          </svg>
        </label>
        <h1>{title}</h1>
      </header>
    )
  }
}

Header.propTypes = {
  title: React.PropTypes.string.isRequired
}
