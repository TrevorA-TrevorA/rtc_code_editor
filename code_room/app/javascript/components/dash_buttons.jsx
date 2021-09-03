import React from 'react';

 export const UploadButton = props => {
    return (
      <div style={{position: "relative", flexGrow: 1}}>
        <input
        id="fileUpload"
        style={{position: "absolute", zIndex: -1}}
        onChange={() => props.uploadDocuments(fileUpload.files)}
        className="dash-button"
        multiple={true}
        accept=".js, .jsx, .ts, .rb, .py, .dart" 
        type="file" 
        title=""/>
        <button style={{width: "100%"}} onClick={() => fileUpload.click()} className="dash-button">UPLOAD</button>
      </div>
    )
}

export const DownloadButton = () => {
  return (
    <button className="dash-button">DOWNLOAD</button>
  )
}

export const DeleteButton = () => {
  return (

    <button className="dash-button">DELETE</button>
  )
}

export const ManageEditorsButton = () => {
  return (
    <button className="dash-button">CO-EDITORS</button>
  )
}