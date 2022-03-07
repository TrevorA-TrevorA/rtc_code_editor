import React from 'react';
import { SELECT, DESELECT } from '../reducers/selection_reducer'
import { Link } from 'react-router-dom';
import connectToDoc from '../channels/doc_channel';
import { GravatarUrl } from '../context/gravatar_url';
import { v4 as uuid } from 'uuid';
import { UPDATE_EDITABLE } from '../reducers/collab_reducer';
import { UPDATE } from '../reducers/doc_reducer';
import downArrow from 'images/down_arrow.png';

class DocRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      editorList: [], 
      editing: false,
    }

    this.subscription;
    this.ref = React.createRef();
    this.saveFile = this.saveFile.bind(this);
  }

  static contextType = GravatarUrl;

  editorListUpdate(data) {
    if (data.arrival) {
      if (this.state.editorList.some(editor => editor.id === data.arrival.id)) return;
      this.setState({ editorList: [...this.state.editorList, data.arrival] })
    }

    if (data.departure) {
      const editors = this.state.editorList.filter(editor => editor.id !== data.departure)
      this.setState({editorList: editors});
    }

    if (data.currentState) {
      if (this.state.editorList.some(editor => editor.id === data.senderId)) return;
      const { email, senderId, senderName, avatarUrl } = data;
      const editor = { email, id: senderId, username: senderName, avatar_url: avatarUrl };
      this.setState({ editorList: [...this.state.editorList, editor] })
    }
  }

  updateDocTitle() {
    const title = $(this.ref.current).find('input.editing-title')[0].value
    const url = `api/documents/${this.props.doc.id}`
    const options = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file_name: title })
    }

    fetch(url, options)
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText)
      } else {
        return res.json();
      }
    }).then(json => {
      this.props.dispatch({ type: UPDATE, doc: json });
      this.setState({editing: false});
    })
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  componentDidUpdate() {
    if (this.state.editing) {
      const $titleEditField = $(this.ref.current).find('input.editing-title');
      $titleEditField.on("keydown", (e) => {
        if (e.code !== "Enter") return;
        e.preventDefault()
        this.updateDocTitle()
      })
    }
  }

  componentDidMount() {
    const callbacks = {
      edit: () => {}, 
      cursor: () => {}, 
      connect: () => {},
      editorList: this.editorListUpdate.bind(this),
      initialize: () => {},
      sendState: () => {},
      syncState: this.editorListUpdate.bind(this),
      ejectUser: () => {},
      assignColor: () => {},
      save: this.updateSavedState.bind(this)
    }

    const $title = $(this.ref.current).find('div.file-name')
    this.titleLength = $title.width();
    
    if (this.props.accessStatus === "Admin") {
      $title.on("dblclick", () => {
        this.setState({editing: true});
      })
    }

    this.subscription = connectToDoc(this.props.doc.id, false, callbacks);
    const awaitSubscription = setInterval(() => {
      if (!this.subscription || this.subscription.identifier) return;
      clearInterval(awaitSubscription);
      if (this.props.resubscribe) this.subscription.resubscribe()
    }, 100);
  }

  updateSavedState(data) {
    if (data.admin_id === this.props.user.id) {
      this.props.dispatch({ type: UPDATE, doc: data.saved_state })
    } else {
      this.props.dispatch({ type: UPDATE_EDITABLE, doc: data.saved_state })
    }
  }

  async saveFile () {
    const { content, file_name } = this.props.doc;
    const file = new File([content], file_name);
    const handle = await window.showSaveFilePicker({ suggestedName: file_name });
    const writable = await handle.createWritable();
    await writable.write(file);
    await writable.close();
  }

  render() {
    const klass = this.props.accessStatus === "Editor" ?
    "doc-row editor" :
    "doc-row";
    
    return(
      <div className={klass} ref={this.ref}>
        <input onChange={(e) => {
          const action = { doc: this.props.doc };
          action.type = e.target.checked ? SELECT : DESELECT;
          this.props.dispatch(action);
        }}
        type="checkbox"
        autoComplete="off"
        />
        {
          this.state.editing ?
          <div className='file-name'>
            <input 
              className='editing-title' 
              type='text' 
              defaultValue={this.props.name}
            />
          </div> :
          <div 
          className="file-name" 
          title={this.props.name}>
            {this.props.name}
        </div>
        }
        <div className="file-size">{this.props.size}</div>
        <div className="file-date">{this.props.updated}</div>
        <div className="access-status">{this.props.accessStatus}</div>
        <div className="doc-row-rightmost">
          <div className="active-editors">
            {
              this.state.editorList.map(editor => {
                return <img
                key={editor.id}
                className="avatar doc-status"
                src={editor.avatar_url || this.context(editor.email)}
                title={editor.username}
                />
              }).slice(0,3)
            }
            { 
              this.state.editorList.length > 3 ? 
              <span
              title={
                this.state.editorList.map(editor => editor.username)
                .join("\n")
              }
              >
                +
              </span> : 
              null 
            }
          </div>
          <button onClick={this.saveFile} className='doc-row-button'>
            <img src={downArrow}/>
          </button>
          <Link 
            to={{
              pathname: `/doc/${this.props.doc.id}`
              }}>
              <button className='doc-row-button'>&#9998;</button>
          </Link>
        </div>
      </div>
    )
  }
}

export default DocRow;