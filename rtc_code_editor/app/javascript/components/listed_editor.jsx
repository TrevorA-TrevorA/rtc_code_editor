import React, { useContext } from 'react';
import { GravatarUrl } from '../context/gravatar_url';

const ListedEditor = props => {
  const gravatar = useContext(GravatarUrl);

  if (props.editorIsAdmin) {
    return (
      <div className="listed-editor">
        <img src={props.editor.avatar_url || gravatar(props.editor.email)} className="avatar"/>
        <p>{props.editor.username} (Admin)</p>
      </div>
    )
  }

  return (
    <div className="listed-editor">
      { 
      props.selfIsAdmin ?
        <button onClick={() => {
          props.removeEditor(props.editor)
        } }
      className="remove-editor-button">
        Remove
      </button> :
      null
      }
      <img src={props.editor.avatar_url || gravatar(props.editor.email)} className="avatar"/>
      <p>{props.editor.username}</p>
    </div>
  )
}

export default ListedEditor;