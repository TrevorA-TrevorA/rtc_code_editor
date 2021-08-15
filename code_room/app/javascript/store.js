import { createStore, applyMiddleware } from 'redux';
import thunk from "redux-thunk";
import  logger  from 'redux-logger';
import { authReducer} from './reducers/auth_reducer';

export const store = createStore(authReducer, { user: window.currentUser }, applyMiddleware(logger, thunk));