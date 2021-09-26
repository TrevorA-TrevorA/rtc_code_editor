import React from 'react';
import { v4 as uuid } from 'uuid';

class CollabManager extends React.Component {
  constructor(props) {
    super(props)
    this.state = { selectedDoc: this.props.selected[0] };
    window.CollabManager = this;
  }

  render() {
    return (
      <div id="collab">
        <button onClick={this.props.callback} id="closeCollab">X</button>
        <div className="editor-search">
          <input className="editor-search-bar" type="text"/>
        </div>
        <div className="collab-details">
        <select className="doc-selector">
            {this.props.selected.map((doc, i) => {
              return (
                <option key={uuid()} defaultValue={!i} value={doc.id}>{doc.file_name}</option>
              )
            })}
          </select>
        </div>
      </div>
    )
  }  
}

export default CollabManager;