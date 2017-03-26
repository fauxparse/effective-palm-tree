import React from 'react'
import { connect } from 'react-redux'
import fetch from '../lib/fetch'
import Layout from './layout'
import Modal from './modal'
import { actions as userActions } from '../actions/user'

class LoginForm extends React.Component {
  constructor(props) {
    super(props)
    this.switchTab = this.switchTab.bind(this)
    this.state = { mode: 'log-in', email: '', password: '' }
  }

  render() {
    const { loading } = this.props
    const { mode } = this.state
    return (
      <div className="login-dialog">
        <ul role="tablist">
          <li
            id="login-tab-log-in"
            role="tab"
            aria-controls="login-log-in"
            aria-selected={mode === 'log-in'}
          >
            <a href="#login-log-in" onClick={this.switchTab}>Log in</a>
          </li>
          <li
            id="login-tab-sign-up"
            role="tab"
            aria-controls="login-sign-up"
            aria-selected={mode === 'sign-up'}
          >
            <a href="#login-sign-up" onClick={this.switchTab}>Sign up</a>
          </li>
        </ul>
        <div
          id="login-log-in"
          role="tabpanel"
          aria-labelledby="login-tab-log-in"
          aria-hidden={mode !== 'log-in'}
        >
          <form onSubmit={this.onLoginSubmit.bind(this)}>
            {this.errors()}
            <fieldset disabled={loading}>
              {this.field('log-in', 'email', 'Email address')}
              {this.field('log-in', 'password', 'Password')}
              <button type="submit">Log in</button>
            </fieldset>
          </form>
        </div>
        <div
          id="login-sign-up"
          role="tabpanel"
          aria-labelledby="login-tab-sign-up"
          aria-hidden={mode != 'sign-up'}
        />
      </div>
    )
  }

  field(form, name, label, type) {
    const id = `${form}-${name}`
    return (
      <div className="field">
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type={type || name}
          name={name}
          value={this.state[name]}
          onInput={e => this.setState({ [name]: e.target.value })}
        />
      </div>
    )
  }

  errors() {
    const errors = (this.props.errors || {})[this.state.mode] || []
    if (errors.length) {
      return (
        <ul className="errors">
          {errors.map(error => <li key={error}>{error}</li>)}
        </ul>
      )
    }
  }

  switchTab(e) {
    e.preventDefault()
    e.stopPropagation()
    const mode = e.currentTarget.href.replace(/^.*#login-/, '')
    this.setState({ mode })
  }

  onLoginSubmit(e) {
    const { email, password } = this.state
    e.preventDefault()
    this.props.tryLogin(email, password)
  }
}

class Security extends React.Component {
  constructor(props) {
    super(props)
    this.handleLogin = this.handleLogin.bind(this)
    this.state = { loaded: false, loading: true, errors: {} }
  }

  componentDidMount() {
    fetch('/session').then(this.handleLogin)
  }

  render() {
    const { children, user } = this.props
    const { errors, loaded, loading } = this.state

    if (user) {
      return <Layout>{children}</Layout>
    } else {
      return (
        <Modal.Container>
          {loaded &&
            <LoginForm
              loading={loading}
              errors={errors}
              tryLogin={this.tryLogin.bind(this)}
            />}
        </Modal.Container>
      )
    }
  }

  tryLogin(email, password) {
    const session = { email, password }
    this.setState({ loading: true })

    fetch('/session', {
      method: 'post',
      body: { session }
    }).then(this.handleLogin)
  }

  handleLogin(response) {
    this.setState({ loaded: true, loading: false })
    if (response.ok) {
      response.json().then(user => {
        this.setState({ errors: {} })
        this.props.logInAs(user)
      })
    } else {
      response
        .json()
        .then(({ error }) => this.setState({ errors: { 'log-in': [error] } }))
        .catch(() => this.setState({ errors: {} }))
    }
  }
}

const mapStateToProps = ({ user }) => ({ user })
const mapDispatchToProps = dispatch => ({
  logInAs: user => dispatch(userActions.logIn(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(Security)
