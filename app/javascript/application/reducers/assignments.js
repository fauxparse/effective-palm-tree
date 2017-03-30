import { groupBy, values } from 'lodash'
import { constants as USER } from '../actions/user'
import { constants as ENTITIES } from '../actions/entities'
import { constants as EVENTS } from '../actions/events'

const updateAssignments = ({ entities, result }) =>
  entities &&
    entities.events &&
    entities.events[result] &&
    entities.assignments &&
    { [result]: values(entities.assignments) } ||
    {}

export default (state = {}, action) => {
  if (action.type === ENTITIES.REFRESH) {
    return { ...state, ...updateAssignments(action) }
  } else if (action.type === USER.LOG_OUT) {
    return {}
  } else {
    return state
  }
}
