import { combineReducers } from 'redux'
import { authReducer } from './auth_reducer'
import { docReducer } from './doc_reducer'

const rootReducer = combineReducers({ user: authReducer, documents: docReducer })

export default rootReducer;

