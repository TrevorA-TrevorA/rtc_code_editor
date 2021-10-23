import React, { useContext } from 'react';
import { GravatarUrl } from '../context/gravatar_url';

const ListedEditor = props => {
  const gravatar = useContext(GravatarUrl);
  
  return (
    <div className="listed-editor">
      <button className="remove-editor-button">Remove</button>
      <img src={props.editor.avatar_url || gravatar(props.editor.email)} className="avatar"/>
      <p>{props.editor.username}</p>
    </div>
  )
}

export default ListedEditor;