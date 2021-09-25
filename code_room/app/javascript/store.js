import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from './reducers/root_reducer';
import md5 from 'md5';
if (window.currentUser) window.currentUser.gravatarHash = md5(window.currentUser.email);
const documents = window.currentUser ? window.currentUser.documents : [];
const editables = window.currentUser ? window.currentUser.editable_documents : [];
export const store = createStore(rootReducer, { user: window.currentUser, documents, editables, selected: [] }, applyMiddleware(logger, thunk));
