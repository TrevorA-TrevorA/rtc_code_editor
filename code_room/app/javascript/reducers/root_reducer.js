import { combineReducers } from 'redux'
import { authReducer } from './auth_reducer'
import { docReducer } from './doc_reducer'
import { collabReducer } from './collab_reducer';
import selectionReducer from './selection_reducer';
import { LOGIN, LOGOUT } from './auth_reducer'



const appReducer = combineReducers({ 
  user: authReducer,
  documents: docReducer,
  editables: collabReducer,
  selected: selectionReducer
})

const rootReducer = (state, action) => {
  switch(action.type) {
    case LOGIN:
      const user = action.user;
      const documents = user.documents;
      const editables = user.accepted_collab_documents;
      const selected = [];
      return { user, documents, editables, selected };
    case LOGOUT:
      console.log("here")
      return { user: null, documents: [], editables: [], selected: []}
    default:
      return appReducer(state, action);
  }
}

export default rootReducer;

