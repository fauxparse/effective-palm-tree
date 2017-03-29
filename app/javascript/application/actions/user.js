import fetch from '../lib/fetch'

const constants = {
  AUTHENTICATE: 'user.authenticate',
  LOG_IN: 'user.log_in',
  LOG_OUT: 'user.log_out'
}

const actions = {
  logIn: user => ({ type: constants.LOG_IN, user }),
  logOut: () =>
    dispatch =>
      fetch('/session', { method: 'DELETE' }).then(
        response => response.ok && dispatch({ type: constants.LOG_OUT })
      )
}

export { actions, constants }
