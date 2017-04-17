import React from 'react'
import { connect } from 'react-redux'
import { last } from 'lodash'
import { query } from '../../lib/reactive_query'
import { invitation as schema } from '../../schema'

class Invitation extends React.Component {
  constructor(props) {
    super(props)
    this.state = { sending: false, email: '' }
  }

  render() {
    const { member, group, invitation } = this.props
    return (
      <section className="invitation">
        {member.registered || this.invitationForm()}
      </section>
    )
  }

  invitationForm() {
    const { invitation } = this.props
    if (invitation) {
      return this.pendingInvitation()
    } else {
      return this.newInvitation()
    }
  }

  pendingInvitation() {
    const { sender } = this.props
    return (
      <p>
        Invited by {sender.name}
      </p>
    )
  }

  newInvitation() {
    const { member, group, invitation } = this.props
    const { email, sending } = this.state
    const emailChanged = e => this.setState({ email: e.target.value })

    return (
      <form className="invitation" onSubmit={this.submit.bind(this)}>
        <fieldset disabled={sending}>
          <p>Invite {member.name} to join {group.name}!</p>
          <div className="form-control">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              required
              onInput={emailChanged}
            />
          </div>
          <button type="submit">
            <span>{sending ? 'Sending…' : 'Send invitation'}</span>
          </button>
        </fieldset>
      </form>
    )
  }

  submit(e) {
    e.preventDefault()
    const { email, sending } = this.state
    if (email && !sending) {
      this.setState({ sending: true })
      this.props.sendInvitation(email)
    }
  }
}

const mapStateToProps = ({ invitations, members }, { member }) => {
  const invitation = last(member && invitations[member.id] || [])
  return {
    invitation,
    sender: invitation && members[invitation.adminId]
  }
}

const mapDispatchToProps = (dispatch, { member }) => ({
  sendInvitation: (email) =>
    dispatch(
      query(
        '/invitations',
        {
          schema,
          method: 'POST',
          body: { memberId: member.id, email }
        }
      )
    )
})

export default connect(mapStateToProps, mapDispatchToProps)(Invitation)
