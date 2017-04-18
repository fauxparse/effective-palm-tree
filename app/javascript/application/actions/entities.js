export const constants = {
  REFRESH: 'entities.refresh',
  DELETE: 'entities.delete'
}

export const actions = {
  refresh: entities => ({ type: constants.REFRESH, entities }),
  delete: entities => ({ type: constants.DELETE, entities })
}

export const before = (event) => event + '.before'
