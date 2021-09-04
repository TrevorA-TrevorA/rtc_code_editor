export const SELECT = 'SELECT';
export const DESELECT = 'DESELECT';

const selectionReducer = (selectedDocIds = [], action) => {
  switch(action.type) {
    case SELECT:
      return [...selectedDocIds, action.docId]
    case DESELECT:
      const newSelectedList = selectedDocIds.filter(docId => docId !== action.docId)
      return newSelectedList;
    default:
      return selectedDocIds;
  }
}

export default selectionReducer;