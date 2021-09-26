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

export class DownloadButton extends React.Component {
  constructor(props) {
    super(props);
    this.downloadDocs = this.downloadDocs.bind(this);
  }

  downloadDocs() {
    const download = (filename, text) => {
      const link = $("<a></a>");
      link.prop('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      link.prop('download', filename);
  
      link.css("display", "none")
      $("body").append(link[0])
  
      link[0].click();
  
      link.remove()
    }

    const docIds = this.props.selected;
    const encoded = window.btoa(JSON.stringify(docIds));
    const url = `api/users/${this.props.user.id}/documents?ids=${encoded}`
    fetch(url, { headers: { "Content-Type": "application/json" } })
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText)
      } else {
        return res.json()
      }
    })
    .then(json => {
      const docs = json;
      docs.forEach(doc => {
        download(doc.file_name, doc.content);
      })
    })
  }

  render() {
    return (
      <button onClick={this.downloadDocs} className="dash-button">DOWNLOAD</button>
    )
  }
}

export const DeleteButton = props => {
  return (
    <button 
    onClick={props.deleteDocuments} 
    className="dash-button">
      DELETE
    </button>
  )
}

export const ManageEditorsButton = () => {
  return (
    <button className="dash-button">EDITORS</button>
  )
}