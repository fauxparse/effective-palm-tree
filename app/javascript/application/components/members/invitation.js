import React from 'react'
import { connect } from 'react-redux'
import { last } from 'lodash'
import moment from 'moment-timezone'
import classNames from 'classnames'
import { query } from '../../lib/reactive_query'
import { invitation as schema } from '../../schema'

class Invitation extends React.Component {
  constructor(props) {
    super(props)
    this.state = { sending: false, email: '' }
  }

  componentWillReceiveProps({ invitation }) {
    if (invitation !== this.props.invitation) {
      const email = invitation && invitation.email || ''
      this.setState({ sending: false, email })
    }
  }

  render() {
    const { member, group, invitation } = this.props
    const { email, sending } = this.state
    const emailChanged = e => this.setState({ email: e.target.value })
    const className = classNames('invitation', { sending, sent: invitation })

    return (
      <form className={className} onSubmit={this.submit.bind(this)}>
        <fieldset disabled={sending}>
          <p>
            {this.heading()}
          </p>
          <div className="form-control">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={email}
              required
              disabled={sending || invitation}
              onInput={emailChanged}
            />
          </div>
          <div className="buttons">
            <button type="submit" rel="send">
              <span>
                {sending ? 'Sending…' : invitation ? 'Re-send' : 'Send'}
              </span>
            </button>
            <button type="button" rel="cancel" onClick={this.cancel.bind(this)}>
              <span>Cancel</span>
            </button>
          </div>
        </fieldset>
      </form>
    )
  }

  heading() {
    const { group, member, invitation, sender } = this.props

    if (invitation) {
      const date = moment(invitation.createdAt).format('D MMMM, YYYY')
      return `Invited on ${date}${sender ? ' by ' + sender.name : ''}`
    } else {
      return `Invite ${member.name} to join ${group.name}!`
    }
  }

  submit(e) {
    e.preventDefault()
    if (this.props.invitation) {
      this.resend(this.props.invitation)
    } else {
      this.send()
    }
  }

  send() {
    const { email, sending } = this.state
    if (email && !sending) {
      this.setState({ sending: true })
      this.props.sendInvitation(email)
    }
  }

  resend(invitation) {
    this.setState({ sending: true })
    this.props.resendInvitation(invitation.token)
  }

  cancel() {
    const { invitation, cancelInvitation } = this.props
    cancelInvitation(invitation.token)
  }
}

const mapStateToProps = ({ invitations, members }, { member }) => {
  const invitation = member && invitations.byMemberId[member.id]
  const sender = invitation && members[invitation.adminId]
  return { invitation, sender }
}

const mapDispatchToProps = (dispatch, { member }) => ({
  sendInvitation: email =>
    dispatch(
      query('/invitations', {
        schema,
        method: 'POST',
        body: { memberId: member.id, email }
      })
    ),
  resendInvitation: token =>
    dispatch(
      query(`/invitations/${token}`, {
        schema,
        method: 'PUT',
      })
    ),
  cancelInvitation: token =>
    dispatch(
      query(`/invitations/${token}`, {
        schema,
        method: 'DELETE'
      })
    )
})

export default connect(mapStateToProps, mapDispatchToProps)(Invitation)
