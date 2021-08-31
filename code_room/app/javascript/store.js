import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from './reducers/root_reducer';

export const store = createStore(rootReducer, { user: window.currentUser, documents: window.currentUser.documents }, applyMiddleware(logger, thunk));
