import { UPLOAD } from '../reducers/doc_reducer'

const uploadDocuments = docs => (dispatch, getState) => {
  const url = `api/users/${getState().user.id}/documents`;
    for (let i = 0; i < docs.length; i++) {
      let doc = docs[i]
      let reader = new FileReader();
      reader.onload = async () => {
        const params = JSON.stringify({ document: {
          size: doc.size,
          file_name:  doc.name,
          content: reader.result
        }})
        
        const headers =  { "Content-Type": "application/json" }
        const options = { body: params, method: 'POST', headers }

        try {
          const res = await fetch(url, options)
          const json = await res.json()
          if (!res.ok) throw new Error(res.statusText);
          dispatch({ type: UPLOAD, doc: json });
        } catch(err) {
          console.log(err);
        }
      }
      reader.readAsText(doc)
    }
}

export default uploadDocuments;