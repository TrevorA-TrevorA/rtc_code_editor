import { DELETE } from '../reducers/doc_reducer'
import { DESELECT } from '../reducers/selection_reducer';

const deleteDocuments = () => (dispatch, getState) => {
  const docs = getState().selected;

  docs.forEach(doc => {
    const url = `api/documents/${doc.id}`;
    fetch(url, { method: DELETE })
    .then(res => {
      if (res.ok) {
        dispatch({ type: DELETE, doc })
        dispatch({ type: DESELECT, doc })
      } else {
        throw new Error(res.statusText)
      }
    })
    .catch(err => console.log(err));
  });
}

export default deleteDocuments;