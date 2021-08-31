import React from 'react';
import { UPLOAD } from '../reducers/doc_reducer';

 export class UploadButton extends React.Component {
   constructor(props) {
     super(props)
     this.addFile = this.addFile.bind(this);
   }

  async addFile(e) {
    const newDocs = e.currentTarget.files;
    const successfullyAddedDocs = [];
    const url = `api/users/${this.props.user.id}/documents`
    for (let i = 0; i < newDocs.length; i++) {
      let doc = newDocs[i]
      let reader = new FileReader();
      reader.readAsText(doc)
      const params = JSON.stringify({ document: {
        size: (doc.size),
        file_name:  doc.name,
      }})
      
      const headers =  { "Content-Type": "application/json" }
      const options = { body: params, method: 'POST', headers }

      try {
        const res = await fetch(url, options)
        const json = await res.json()
        if (!res.ok) throw new Error(res.statusText);
        let { name, size } = doc;
        let docRecord = { file_name: name, size, id: json.id }
        docRecord.updated_at = json.updated_at;
        successfullyAddedDocs.push(docRecord);
      } catch(err) {
        console.log(err);
      }
   }
    fileUpload.value = ""
    this.props.dispatch({ type: UPLOAD, documents: successfullyAddedDocs })
  }

   render() {
    return (
      <div style={{position: "relative", flexGrow: 1}}>
        <input
        id="fileUpload"
        style={{position: "absolute", zIndex: -1}}
        onChange={this.addFile}
        className="dash-button"
        multiple={true}
        accept=".js, .jsx, .ts, .rb, .py, .dart" 
        type="file" 
        title=""/>
        <button style={{width: "100%"}} onClick={() => fileUpload.click()} className="dash-button">UPLOAD</button>
      </div>
    )
   }
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