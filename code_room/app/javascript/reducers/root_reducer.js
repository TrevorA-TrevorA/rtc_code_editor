import { combineReducers } from 'redux'
import { authReducer } from './auth_reducer'
import { docReducer } from './doc_reducer'
import selectionReducer from './selection_reducer';

const rootReducer = combineReducers({ 
  user: authReducer, 
  documents: docReducer,
  selected: selectionReducer
})

export default rootReducer;

