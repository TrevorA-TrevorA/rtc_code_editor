import { DELETE } from '../reducers/doc_reducer'
import { DESELECT } from '../reducers/selection_reducer';

const deleteDocuments = () => (dispatch, getState) => {
  const docIds = getState().selected;

  docIds.forEach(docId => {
    const url = `api/documents/${docId}`;
    fetch(url, { method: DELETE })
    .then(res => {
      if (res.ok) {
        dispatch({ type: DELETE, docId })
        dispatch({ type: DESELECT, docId })
      } else {
        throw new Error(res.statusText)
      }
    })
    .catch(err => console.log(err));
  });
}

export default deleteDocuments;