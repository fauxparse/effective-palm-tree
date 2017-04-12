const constants = {
  SHOW: 'sidebar.show',
  HIDE: 'sidebar.hide'
}

const actions = {
  show: () => ({ type: constants.SHOW }),
  hide: () => ({ type: constants.HIDE })
}

export { actions, constants }
