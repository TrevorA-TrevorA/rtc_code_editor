import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/root_reducer';
const currentUser = window.currentUser;
delete window.currentUser;
const loggedIn = !!currentUser;
const documents = loggedIn ? currentUser.documents : [];
const editables = loggedIn ? currentUser.accepted_collab_documents : [];
const collaborations = loggedIn ? currentUser.collaborations : [];
const avatarUrl = loggedIn ? currentUser.avatar_url : null;
const notifications = loggedIn ? currentUser.notifications : [];
notifications.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
const initialState = { 
  user: currentUser, 
  documents, 
  collaborations, 
  editables,
  avatarUrl,
  selected: [],
  notifications,
  errorMessage: ""
}

export const store = createStore(rootReducer, initialState, applyMiddleware(thunk));
