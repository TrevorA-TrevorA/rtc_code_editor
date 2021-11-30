import React from 'react';
import { SELECT, DESELECT } from '../reducers/selection_reducer'
import { Link } from 'react-router-dom';
import connectToDoc from '../channels/doc_channel';
import { GravatarUrl } from '../context/gravatar_url';
import { v4 as uuid } from 'uuid';
import { UPDATE_EDITABLE } from '../reducers/collab_reducer';
import { UPDATE } from '../reducers/doc_reducer';

class DocRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = { editorList: [], docState: "" }
    this.subscription;
  }

  static contextType = GravatarUrl;

  editorListUpdate(data) {
    this.setState({editorList: data.editors })
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  componentDidMount() {
    const callbacks = {
      edit: () => {}, 
      cursor: () => {}, 
      connect: () => {},
      editorList: this.editorListUpdate.bind(this),
      initialize: () => {},
      sendState: () => {},
      syncState: () => {},
      save: this.updateSavedState.bind(this)
    }

    this.subscription = connectToDoc(this.props.doc.id, false, callbacks);
  }

  updateSavedState(data) {
    if (data.admin) {
      this.props.dispatch({ type: UPDATE, doc: data.saved_state })
    } else {
      this.props.dispatch({ type: UPDATE_EDITABLE, doc: data.saved_state })
    }
  }


  render() {
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
        <div className="file-name" title={this.props.name}>{this.props.name}</div>
        <div className="file-size">{this.props.size}</div>
        <div className="file-date">{this.props.updated}</div>
        <div className="access-status">{this.props.accessStatus}</div>
        <div className="doc-row-rightmost">
        <div className="active-editors">
          {
            this.state.editorList.map(editor => {
              return <img
              key={uuid()}
              className="avatar doc-status"
              src={editor.avatar_url || this.context(editor.email)}
              title={editor.username}
              />
            })
          }
        </div>
        <Link 
          to={{
            pathname: `/doc/${this.props.doc.id}/room`
            }}>
            <button>OPEN</button>
        </Link>
        </div>
      </div>
    )
  }
}

export default DocRow;