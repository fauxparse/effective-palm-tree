import React from 'react'

export default class Header extends React.Component {
  render() {
    const { title } = this.props

    return (
      <header>
        <h1>{title}</h1>
      </header>
    )
  }
}

Header.propTypes = {
  title: React.PropTypes.string.isRequired
}
