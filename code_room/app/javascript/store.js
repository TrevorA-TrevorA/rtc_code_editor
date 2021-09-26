import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from './reducers/root_reducer';
const documents = window.currentUser ? window.currentUser.documents : [];
const editables = window.currentUser ? window.currentUser.editable_documents : [];
export const store = createStore(rootReducer, { user: window.currentUser, documents, editables, selected: [] }, applyMiddleware(logger, thunk));
