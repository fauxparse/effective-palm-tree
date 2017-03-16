import React from 'react'
import Select from './select'

export default class EventRoles extends React.Component {
  constructor(props) {
    super(props)
    this.state = { roleId: props.group.roles[1].id }
  }

  render() {
    const { event, group } = this.props
    const { roleId } = this.state
    return (
      <section className="event-roles">
        <Select
          selected={roleId}
          options={group.roles.map(({ id, name }) => [id, name])}
          onChange={(roleId) => this.setState({ roleId })}/>
      </section>
    )
  }
}
