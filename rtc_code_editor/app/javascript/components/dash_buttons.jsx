import React from 'react';
import { acceptString } from "../language_modes";
import { openNewDocForm } from './dash';

export const AddNewDoc = () => {
  return (
    <button
      className='dash-button new-doc'
      onClick={openNewDocForm}
    >
      +
    </button>
  )
}

export const UploadButton = props => {
    return (
      <div style={{position: "relative", flexGrow: 1}}>
        <input
        id="fileUpload"
        style={{position: "absolute", zIndex: -1}}
        onChange={() => props.uploadDocuments(fileUpload.files)}
        className="dash-button"
        multiple={true}
        accept={acceptString}
        type="file" 
        title=""/>
        <button style={{width: "100%"}} onClick={() => fileUpload.click()} className="dash-button">UPLOAD</button>
      </div>
    )
}

export const DeleteButton = props => {
  
  return (
    <button 
    onClick={props.removeDocuments} 
    className="dash-button">
      REMOVE
    </button>
  )
}

export const ManageEditorsButton = props => {
  return (
    <button onClick={props.callback} className="dash-button">EDITORS</button>
  )
}