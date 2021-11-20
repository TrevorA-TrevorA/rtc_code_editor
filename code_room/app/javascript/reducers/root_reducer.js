import { authReducer, LOGIN, LOGOUT } from './auth_reducer'
import { docReducer, UPLOAD, DELETE } from './doc_reducer'
import { ADD_COLLABORATION, collabReducer, REMOVE_COLLABORATION } from './collab_reducer';
import { selectionReducer, SELECT, DESELECT } from './selection_reducer';
export const UPDATE_AVATAR_URL = "UPDATE AVATAR URL";
export const DELETE_AVATAR_URL = "DELETE AVATAR URL";

const rootReducer = (state, action) => {
  const newState = {};
  Object.assign(newState, state);

  switch(action.type) {
    case LOGIN: 
      return authReducer(null, action);
    case LOGOUT:
      return authReducer(null, action);
    case UPLOAD:
      newState.documents = docReducer(state.documents, action);
      return newState;
    case DELETE:
      newState.documents = docReducer(state.documents, action);
      return newState;
    case ADD_COLLABORATION:
      return collabReducer(state, action);
    case REMOVE_COLLABORATION:
      return collabReducer(state, action);
    case SELECT:
      newState.selected = selectionReducer(state.selected, action)
      return newState;
    case DESELECT:
      newState.selected = selectionReducer(state.selected, action)
      return newState;
    case UPDATE_AVATAR_URL:
      newState.avatarUrl = action.url;
      return newState;
    case DELETE_AVATAR_URL:
      newState.avatarUrl = null;
      return newState;
    default:
      return state;
  }
}

export default rootReducer;

