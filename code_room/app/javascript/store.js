import { createStore } from 'redux';
import { authReducer} from './reducers/auth_reducer';

export const store = createStore(authReducer, { user: window.currentUser });