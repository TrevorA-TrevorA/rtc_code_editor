export const SELECT = 'SELECT';
export const DESELECT = 'DESELECT';

const selectionReducer = (selectedDocs = [], action) => {
  switch(action.type) {
    case SELECT:
      return [...selectedDocs, action.doc]
    case DESELECT:
      const newSelectedList = selectedDocs.filter(doc => doc.id !== action.doc.id)
      return newSelectedList;
    default:
      return selectedDocs;
  }
}

export default selectionReducer;