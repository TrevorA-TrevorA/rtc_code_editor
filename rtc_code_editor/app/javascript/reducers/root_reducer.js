import { authReducer, LOGIN, LOGOUT } from './auth_reducer'
import { docReducer, UPLOAD, DELETE, UPDATE } from './doc_reducer'
import { selectionReducer, SELECT, DESELECT } from './selection_reducer';
import { SET_NOTIFICATIONS, CLEAR_NOTIFICATIONS, notificationReducer } from './notification_reducer';
export const SET_ERROR = "SET ERROR"
export const CLEAR_ERROR = "CLEAR ERROR"
export const UPDATE_AVATAR_URL = "UPDATE AVATAR URL";
export const DELETE_AVATAR_URL = "DELETE AVATAR URL";
import { 
  ADD_COLLABORATION, 
  collabReducer, 
  REMOVE_COLLABORATION,
  UPDATE_EDITABLE
} from './collab_reducer';

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
      newState.user = {...newState.user, avatar_url: action.url}
      return newState;
    case DELETE_AVATAR_URL:
      newState.avatarUrl = null;
      newState.user = {...newState.user, avatar_url: null}
      return newState;
    case UPDATE:
      newState.documents = docReducer(state.documents, action);
      return newState;
    case UPDATE_EDITABLE:
      return collabReducer(state, action);
    case SET_NOTIFICATIONS:
      newState.notifications = notificationReducer(null, action)
      return newState;
    case CLEAR_NOTIFICATIONS:
      newState.notifications = notificationReducer(null, action)
      return newState;
    case SET_ERROR:
      newState.errorMessage = action.error;
      return newState;
    case CLEAR_ERROR:
      newState.errorMessage = ""
      return newState;
    default:
      return state;
  }
}

export default rootReducer;

