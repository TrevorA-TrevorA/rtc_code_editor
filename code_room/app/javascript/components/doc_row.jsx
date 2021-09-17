import React from 'react';
import { SELECT, DESELECT } from '../reducers/selection_reducer'

const FileOpenButton = props => {
    
  return (
    <button 
    onClick={props.callback} 
    className="doc-row-rightmost">OPEN</button>
  )
}

const DocRow = props => {
  const openRoom = () => {
    location.assign(`/doc/${props.docId}/room`)
  }

  return(
    <div className="doc-row">
      <input onChange={(e) => {
        const action = { docId: props.docId };
        action.type = e.target.checked ? SELECT : DESELECT;
        props.dispatch(action);
      }}
      type="checkbox"
      />
      <p className="file-name" title={props.name}>{props.name}</p>
      <p className="file-size">{props.size}</p>
      <p className="file-date">{props.updated}</p>
      <p className="access-status">{props.accessStatus}</p>
      <FileOpenButton callback={openRoom}/>
    </div>
  )
}

export default DocRow;