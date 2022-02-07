import React, { useEffect, useState } from 'react';
import DocRowContainer from '../containers/doc_row_container';
import { v4 as uuid } from 'uuid';
import NewDocRow from './new_doc_row';

const DocListHeader = props => {
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
      type="checkbox"
      autoComplete="off"/>
      <p className="file-name">File Name</p>
      <p className="file-size">Size (Bytes)</p>
      <p className="file-date">Updated</p>
      <p className="access-status">Access</p>
      <p className="doc-row-rightmost">Total: {props.docCount}</p>
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

  const [ resubscribe, setResubscribe] = useState(false);

  useEffect(() => setResubscribe(true))
  const docs = props.documents;
  const editables = props.editables;

  const dateFormat = new Intl.DateTimeFormat("en-US", options)
  const combinedDocs = docs.concat(editables);
  combinedDocs.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  const combinedDocRows = combinedDocs.map((file) => {
    const date = dateFormat
    .format(new Date(file.updated_at))
    .replaceAll(/\//g, "-")
    return <DocRowContainer
    key={uuid()}
    doc={file}
    name={file.file_name}
    size={file.size}
    accessStatus={ file.admin_id === props.user.id ? "Admin" : "Editor" }
    resubscribe={resubscribe}
    updated={date}
    />
  })

  const { user, dispatch } = props;
  return (
    <div id="docList">
      <DocListHeader docCount={docs.concat(editables).length}/>
      { props.newDoc ? <NewDocRow { ...{ user, dispatch } } /> : null }
      <div id="docListBody">
      {combinedDocRows}
      </div>
    </div>
  )
}

export default DocList;
