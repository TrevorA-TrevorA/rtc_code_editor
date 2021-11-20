import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from './reducers/root_reducer';
const loggedIn = !!window.currentUser;
const documents = loggedIn ? window.currentUser.documents : [];
const editables = loggedIn ? window.currentUser.accepted_collab_documents : [];
const collaborations = loggedIn ? window.currentUser.collaborations : [];
const avatarUrl = loggedIn ? window.currentUser.avatar_url : null;
const initialState = { 
  user: window.currentUser, 
  documents, 
  collaborations, 
  editables,
  avatarUrl,
  selected: []
}

export const store = createStore(rootReducer, initialState, applyMiddleware(logger, thunk));
