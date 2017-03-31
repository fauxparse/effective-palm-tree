export const constants = {
  REFRESH: 'entities.refresh'
}

export const actions = {
  refresh: entities => ({ type: constants.REFRESH, entities })
}

export const before = (event) => event + '.before'
