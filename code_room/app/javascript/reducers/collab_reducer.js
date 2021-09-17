export const ADD = 'ADD';
export const REMOVE = 'REMOVE';

export const collabReducer = (editables = [], action) => {
  if (editables.length > 1) {
    editables.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
  }

  switch (action.type) {
    case ADD:
      return [action.doc, ...editables]
    case REMOVE:
      const newList = editables.filter(doc => doc.id !== action.docId);
      return newList
    default:
      return editables;
  }
};
