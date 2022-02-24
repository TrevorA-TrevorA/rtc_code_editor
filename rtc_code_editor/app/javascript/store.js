import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from './reducers/root_reducer';
const loggedIn = !!window.currentUser;
const documents = loggedIn ? window.currentUser.documents : [];
const editables = loggedIn ? window.currentUser.accepted_collab_documents : [];
const collaborations = loggedIn ? window.currentUser.collaborations : [];
const avatarUrl = loggedIn ? window.currentUser.avatar_url : null;
const notifications = loggedIn ? window.currentUser.notifications : [];
notifications.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
const initialState = { 
  user: window.currentUser, 
  documents, 
  collaborations, 
  editables,
  avatarUrl,
  selected: [],
  notifications,
  errorMessage: ""
}

export const store = createStore(rootReducer, initialState, applyMiddleware(logger,thunk));
