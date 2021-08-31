export const UPLOAD = 'UPLOAD';
export const DELETE = 'DELETE';

export const docReducer = (docState = [], action) => {
  switch (action.type) {
    case UPLOAD:
      return [...docState, ...action.documents]
    case DELETE:
      const newList = [];
      docState.forEach( doc => {
        if (!action.documents.includes(doc)) {
          newList.push(doc);
        }
      })
      return { documents: newList }
    default:
      return docState;
  }
};
