import React from 'react';
import DocRowContainer from '../containers/doc_row_container';

const DocListHeader = () => {
  return (
    <div className="doc-row">
      <input onClick={
        (e) => {
          $("input[type='checkbox']").each((i, c) => {
            if (!i) return;
            if (e.target.checked !== c.checked) c.click();
          })
        }
      } 
      type="checkbox"/>
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
        return <DocRowContainer
        key={file.file_name}
        docId={file.id}
        name={file.file_name}
        size={file.size}
        updated={date}
        />
      })}
    </div>
  )
}

export default DocList;
