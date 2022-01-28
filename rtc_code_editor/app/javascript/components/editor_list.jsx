import React, { useEffect } from 'react';
import connectToEditors from '../channels/editors_channel';
import ListedEditor from './listed_editor';
import { v4 as uuid } from 'uuid';

const EditorList = props => {
  console.log(props.isAdmin);
  const subscription = connectToEditors(props.document_id, props.receiveEditors, props.isAdmin)
  useEffect(() => {
    return () => {
      subscription.unsubscribe()
    }
  })

  return (
    <div className="editor-list">
      {
        props.docAdmin ?
        <ListedEditor 
          key={uuid()}
          editor={props.docAdmin}
          editorIsAdmin={true}
          selfIsAdmin={props.isAdmin}
        /> :
        null
      }
      { 
      props.editors.map(editor => {
        return <ListedEditor 
        key={uuid()}
        removeEditor={props.removeEditor(subscription)}
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