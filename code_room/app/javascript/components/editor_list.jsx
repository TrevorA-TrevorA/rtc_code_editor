import React, { useEffect, useState } from 'react';
import connectToEditors from '../channels/editors_channel';
import ListedEditor from './listed_editor';
import { v4 as uuid } from 'uuid';

const EditorList = props => {
  const subscription = connectToEditors(props.document_id, receiveEditors)
  console.log(subscription);

  const [editors, setEditors] = useState([])

  useEffect(() => {
    return () => subscription.unsubscribe();
  })

  function receiveEditors(data) {
    if (data.new_editor) {
      setEditors([...editors, data.new_editor]);
      return;
    }

    setEditors(data.editors);
  }
  
  return (
    <div className="editor-list">
      { 
      editors.map(editor => {
        return <ListedEditor key={uuid()} editor={editor} />
      }) 
      }
    </div>
  )
}

export default EditorList;