import React from 'react';

const FileOpenButton = props => {
  return (
    <button className="file-open-button">OPEN</button>
  )
}

const DocRow = props => {
  return(
    <div className="doc-row">
      <input type="checkbox"/>
      <p className="file-name">{props.name}</p>
      <p className="file-size">{props.size}</p>
      <p className="file-date">{props.updated}</p>
      <FileOpenButton/>
    </div>
  )
}

const DocListHeader = props => {
  return (
    <div className="doc-row">
      <input type="checkbox"/>
      <p className="file-name">Name</p>
      <p className="file-size">Size (Bytes)</p>
      <p className="file-date">Updated</p>
    </div>
  )
}

const DocList = props => {
  const options = {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true
  }

  const dateFormat = new Intl.DateTimeFormat("en-US", options)
  return (
    <div id="docList">
      <DocListHeader/>
      {props.documents.map(file => {
        const date = dateFormat
        .format(new Date(file.updated_at))
        .replaceAll(/\//g, "-")
        return <DocRow
        key={file.file_name} 
        name={file.file_name}
        size={file.size}
        updated={date}
        />
      })}
    </div>
  )
}

export default DocList;
