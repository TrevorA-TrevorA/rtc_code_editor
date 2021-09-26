import React from 'react';
import { SELECT, DESELECT } from '../reducers/selection_reducer'

const FileOpenButton = props => {
  return (
    <button
    className="doc-row-rightmost"
    onClick={props.callback}>
      OPEN
    </button>
  )
}


class DocRow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const openRoom = () => {
      location.assign(`/doc/${this.props.doc.id}/room`)
    }

    return(
      <div className="doc-row">
        <input onChange={(e) => {
          const action = { doc: this.props.doc };
          action.type = e.target.checked ? SELECT : DESELECT;
          this.props.dispatch(action);
        }}
        type="checkbox"
        autoComplete="off"
        />
        <p className="file-name" title={this.props.name}>{this.props.name}</p>
        <p className="file-size">{this.props.size}</p>
        <p className="file-date">{this.props.updated}</p>
        <p className="access-status">{this.props.accessStatus}</p>
        <FileOpenButton callback={openRoom}/>
      </div>
    )
  }
}

export default DocRow;