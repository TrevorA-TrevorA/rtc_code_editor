export const ADD_COLLABORATION = 'ADD_COLLABORATION';
export const REMOVE_COLLABORATION = 'REMOVE_COLLABORATION';
export const UPDATE_EDITABLE = 'UPDATE_EDITABLE';

export const collabReducer = (state, action) => {
  const newState = {};
  Object.assign(newState, state);

  const { collaborations, editables } = state;

  switch (action.type) {
    case ADD_COLLABORATION:
      newState.collaborations = [action.collaboration, ...collaborations]
      newState.editables = [action.doc, ...editables]
      return newState;
    case REMOVE_COLLABORATION:
      const newEditablesList = editables.filter(doc => doc.id !== action.docId);
      const newCollabsList = collaborations.filter(col => col.id !== action.collaborationId);
      newState.editables = newEditablesList;
      newState.collaborations = newCollabsList;
      return newState;
    case UPDATE_EDITABLE:
      const updatedEditablesList = editables.filter(doc => doc.id !== action.doc.id);
      updatedEditablesList.push(action.doc)
      newState.editables = updatedEditablesList;
      return newState;
    default:
      return state;
  }
};
