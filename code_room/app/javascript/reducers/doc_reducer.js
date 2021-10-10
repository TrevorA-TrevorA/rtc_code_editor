export const UPLOAD = 'UPLOAD';
export const DELETE = 'DELETE';

export const docReducer = (docState = [], action) => {

  switch (action.type) {
    case UPLOAD:
      return [action.doc, ...docState]
    case DELETE:
      const newList = docState.filter(doc => doc.id !== action.doc.id);
      return newList
    default:
      return docState;
  }
};
