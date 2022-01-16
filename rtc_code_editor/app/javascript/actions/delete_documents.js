import { REMOVE_COLLABORATION } from '../reducers/collab_reducer';
import { DELETE } from '../reducers/doc_reducer'
import { DESELECT } from '../reducers/selection_reducer';

const removeDocuments = () => (dispatch, getState) => {
  const selectedDocs = getState().selected;
  const currentUserDocs = getState().documents;
  const user = getState().user;

  selectedDocs.forEach(doc => {
    let url;
    let isAdmin;

    if (currentUserDocs.some(userDoc => userDoc.id === doc.id)) {
      url = `api/documents/${doc.id}`;
      isAdmin = true
    } else {
      url = `api/users/${user.id}/collaborations/${doc.id}`;
      isAdmin = false;
    }
    console.log(isAdmin);
    fetch(url, { method: 'DELETE' })
    .then(res => {
      if (res.ok && isAdmin) {
        dispatch({ type: DELETE, doc })
        dispatch({ type: DESELECT, doc })
      } else if (res.ok && !isAdmin) {
        return res.json();
      } else {
        throw new Error(res.statusText)
      }
    })
    .then(json => {
      if (!json) return;
      const collaborationId = json.collaboration_id;
      dispatch({ type: REMOVE_COLLABORATION, docId: doc.id, collaborationId })
      dispatch({ type: DESELECT, doc })
    })
    .catch(err => console.log(err));
  });
}

export default removeDocuments;