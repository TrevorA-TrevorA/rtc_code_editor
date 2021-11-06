import React, { useEffect, useState } from 'react';
import connectToEditors from '../channels/editors_channel';
import ListedEditor from './listed_editor';
import { v4 as uuid } from 'uuid';

const EditorList = props => {
  const subscription = connectToEditors(props.document_id, receiveEditors, props.isAdmin)

  let [editors, setEditors] = useState([]);
  let [admin, setAdmin] = useState(null);

  useEffect(() => {
    return () => subscription.unsubscribe();
  })

  const removeEditor = (editor) => {
    const url = `api/collaborations/${editor.collab_id}`
    fetch(url, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText);
      } else {
        let idx = editors.indexOf(editor);
        editors.splice(idx, 1);
        setEditors([...editors]);
      }
    }).catch(error => console.log(error))
  }

  function receiveEditors(data) {
    if (data.new_editor) {
      setEditors([...editors, data.new_editor]);
      return;
    }

    console.log(data.admin);
    if (data.admin) setAdmin(data.admin);

    setEditors(data.editors);
  }

  return (
    <div className="editor-list">
      {
        admin ?
        <ListedEditor 
          key={uuid()}
          editor={admin}
          editorIsAdmin={true}
          selfIsAdmin={props.isAdmin}
        /> :
        null
      }
      { 
      editors.map(editor => {
        return <ListedEditor 
        key={uuid()}
        removeEditor={removeEditor}
        editor={editor}
        editorIsAdmin={false}
        selfIsAdmin={props.isAdmin}
        />
      }) 
      }
    </div>
  )
}

export default EditorList;