import React, { useEffect } from 'react';
import { UPLOAD } from '../reducers/doc_reducer';
import { closeNewDocForm } from './dash';

const NewDocRow = props => {
  const createNewDoc = () => {
    if (!fileName.value) {
      closeNewDocForm();
      return;
    }

    const url = `api/users/${props.user.id}/documents`
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        file_name: fileName.value,
        size: 0,
        content: ''
      })
    }

    fetch(url, options)
    .then(res => {
      if (!res.ok) {
        throw Error(res.statusText);
      } else {
        return res.json()
      }
    })
    .then(json => {
      props.dispatch({ type: UPLOAD, doc: json })
      closeNewDocForm();
    })
  }

  useEffect(() => {
    $(fileName).on('keydown', (e) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        closeNewDocForm();
      }

      if (e.code !== 'Enter') return;
      e.preventDefault();
      createNewDoc();
    })
  })
  
  
  return (
    <div className='doc-row'>
      <div className='file-name'>
        <input id="fileName" type='text' placeholder='enter file name'/>
        <button onClick={createNewDoc}>
          ADD
        </button>
    </div>
  </div>
  )
}

export default NewDocRow;