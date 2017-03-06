const constants = {
  LOG_IN: 'user.log_in'
}

const actions = {
  logIn: (user) => ({ type: constants.LOG_IN, user })
}

export { actions, constants }
