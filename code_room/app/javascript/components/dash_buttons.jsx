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

    const docs = this.props.selected;
    docs.forEach(doc => {
      download(doc.file_name, doc.content);
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

export const ManageEditorsButton = props => {
  return (
    <button onClick={props.callback} className="dash-button">EDITORS</button>
  )
}