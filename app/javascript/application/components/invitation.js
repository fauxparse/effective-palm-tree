import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { Link } from 'react-router'
import { flowRight as compose, pick, sortBy, values } from 'lodash'
import classNames from 'classnames'
import { query } from '../lib/reactive_query'
import { invitation as schema } from '../schema'
import { actions as invitations } from '../actions/invitations'
import Stackable from '../lib/stackable'
import Header from './header'
import Icon from './icon'

class Invitation extends React.Component {
  constructor(props) {
    super(props)
    this.state = { sending: false }
  }

  componentDidMount() {
    this.props.fetchInvitation()
  }

  componentWillReceiveProps({ invitation: { status } }) {
    const { go, group } = this.props

    if (status === 'accepted') {
      go(`/groups/${group.id}`)
    } else if (status === 'declined') {
      go('/')
    }
  }

  render() {
    const { children, className, group, admin } = this.props
    const { invitation } = this.props
    return (
      <section className={classNames(className, 'invitation page')}>
        <Header title={group ? `Join ${group.name}` : 'Loading…'} />
        <section className="content">
          {invitation && admin && group && this.form()}
        </section>
        {children}
      </section>
    )
  }

  form() {
    const { admin, group, invitation, accept, decline } = this.props
    const { sending } = this.state
    return (
      <form className="invitation">
        <fieldset disabled={sending}>
          <Icon name="ILLUSTRATIONS.ENVELOPE" className="envelope" />
          <p>{admin.name} has invited you to join {group.name}.</p>
          <footer className="buttons">
            <button type="button" onClick={accept} rel="accept">
              <span>Accept</span>
            </button>
            <button type="button" onClick={decline} rel="decline">
              <span>Decline</span>
            </button>
          </footer>
        </fieldset>
      </form>
    )
  }
}

const mapStateToProps = (
  { invitations, members, groups },
  { params: { token } }
) => {
  const invitation = invitations.byToken[token]
  const member = invitation && members[invitation.memberId]
  const admin = invitation && members[invitation.adminId]
  const group = invitation && groups[invitation.group]
  return { invitation, member, admin, group }
}

const mapDispatchToProps = (dispatch, { params: { token } }) => ({
  fetchInvitation: () => dispatch(query(`/invitations/${token}`, { schema })),
  accept: () => dispatch(invitations.accept(token)),
  decline: () => dispatch(invitations.decline(token)),
  go: (path) => dispatch(push(path))
})

export default compose(connect(mapStateToProps, mapDispatchToProps), Stackable)(
  Invitation
)
