import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from './reducers/root_reducer';
const documents = window.currentUser ? window.currentUser.documents : [];
const editables = window.currentUser ? window.currentUser.accepted_collab_documents : [];
const collaborations = window.currentUser ? window.currentUser.collaborations : [];
export const store = createStore(rootReducer, { user: window.currentUser, documents, collaborations, editables, selected: [] }, applyMiddleware(logger, thunk));
