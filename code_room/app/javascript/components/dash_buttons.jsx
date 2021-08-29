import React from 'react';

export const DashButtons = () => {
  return (
    <div className="dash-button-row">
      <UploadButton/>
      <DownloadButton/>
      <DeleteButton/>
      <ManageEditorsButton/>
    </div>
  )
}

export const UploadButton = (props) => {
  return (
    <div style={{position: "relative", flexGrow: 1}}>
      <input
      id="fileUpload"
      style={{position: "absolute", zIndex: -1}}
      className="dash-button"
      accept=".js, .jsx, .ts, .rb, .py, .dart" 
      onChange={props.callback} 
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