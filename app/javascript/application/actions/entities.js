export const constants = {
  REFRESH: 'entities.refresh'
}

export const actions = {
  refresh: entities => ({ type: constants.REFRESH, entities })
}
