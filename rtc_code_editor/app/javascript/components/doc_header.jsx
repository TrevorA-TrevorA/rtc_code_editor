import React, { useContext } from 'react'
import { GravatarUrl } from '../context/gravatar_url';
import { v4 as uuid } from 'uuid';

const DocHeader = props => {
  window.DocHeaderProps = props;
  const gravatar = useContext(GravatarUrl);
  
  return (
    <div className="doc-header">
      <p 
        className="doc-header-text"
        title={props.docTitle}
        >{props.docTitle}
      </p>
      <div className="editor-avatars">
        { 
        props.editors.map(editor => {
          return (
            <img key={uuid()} className="avatar present" 
            src={editor.avatar_url || gravatar(editor.email)}
            />
            )
        }).slice(0,5) 
        }
          { props.editors.length > 5 ? 
          <span title={
            props.editors.map(editor => editor.username).join("\n")
            }>
            +
          </span> : 
          null 
        }
      </div>
    </div>
  )
}

export default DocHeader;