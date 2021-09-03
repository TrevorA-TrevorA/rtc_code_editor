export const UPLOAD = 'UPLOAD';
export const DELETE = 'DELETE';

export const docReducer = (docState = [], action) => {
  if (docState.length > 1) {
    docState.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
  }

  switch (action.type) {
    case UPLOAD:
      return [action.doc, ...docState]
    case DELETE:
      const newList = docState.filter(doc => doc !== action.doc);
      return { documents: newList }
    default:
      return docState;
  }
};
