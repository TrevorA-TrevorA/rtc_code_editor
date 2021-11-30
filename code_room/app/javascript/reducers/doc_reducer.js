export const UPLOAD = 'UPLOAD';
export const DELETE = 'DELETE';
export const UPDATE = 'UPDATE';

export const docReducer = (docState = [], action) => {

  switch (action.type) {
    case UPLOAD:
      return [action.doc, ...docState]
    case DELETE:
      const newList = docState.filter(doc => doc.id !== action.doc.id);
      return newList
    case UPDATE:
      const updatedList = docState.filter(doc => doc.id !== action.doc.id);
      updatedList.push(action.doc);
      return updatedList;
    default:
      return docState;
  }
};
