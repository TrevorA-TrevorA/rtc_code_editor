import React, { useContext } from 'react'
import { GravatarUrl } from '../context/gravatar_url';
import { v4 as uuid } from 'uuid';

const DocHeader = props => {
  const gravatar = useContext(GravatarUrl);
  
  return (
    <div className="doc-header">
      <p className="doc-header-text">{props.docTitle}</p>
      <div className="editor-avatars">
        { 
        props.editors.map(editor => {
          return (
            <img key={uuid()} className="avatar present" 
            src={editor.avatar_url || gravatar(editor.email)}
            />
            )
        }) 
        }
      </div>
    </div>
  )
}

export default DocHeader;