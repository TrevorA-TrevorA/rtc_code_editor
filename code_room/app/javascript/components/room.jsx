import React from 'react';
import connectToDoc from '../channels/doc_channel';
import NavContainer from '../containers/nav_container'
import AceEditor from 'react-ace';
import ChatBox from './chat_box';
import DocHeader from './doc_header'
import "ace-builds";
import "ace-builds/webpack-resolver";
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import { UPDATE } from '../reducers/doc_reducer'
import { UPDATE_EDITABLE } from '../reducers/collab_reducer'

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.getEditorMode = this.getEditorMode.bind(this);
    this.state = { 
      editorText: "",
      editorMode: "javascript",
      initialState: true,
      docTitle: '',
      editorList: [],
      savedState: ''
    }

    

    this.docId = this.props.match.params.docId;
    this.receiveEdit = this.receiveEdit.bind(this);
    this.broadcastEdit = this.broadcastEdit.bind(this);
    this.ensureDeltaOrder = this.ensureDeltaOrder.bind(this);
    this.editorRef = React.createRef();
    this.broadcastChange = true;
    this.deltaHistory = [];
    this.localDeltaHistory = [];
    this.pending = [];
    this.docSubscription;
    window.room = this;
  }

  broadcastEdit(content, event) {
    const time = Date.now();
    window.changeEvent = event;
    if (!this.broadcastChange) return;

    const editor = this.editorRef.current.editor;
    let currentLine;
    if (event.lines.length === 1) {
      currentLine = editor.session.doc.$lines[event.start.row].slice(0,-1);
    } else {
      currentLine = editor.session.doc.$lines[event.start.row];
    }

    const delta = {
      time,
      senderId: this.props.user.id,
      changeData: event,
      currentLine,
      currentContent: content
    }

    this.docSubscription.send(delta);
    this.localDeltaHistory.push(delta);
    this.deltaHistory.push(delta);
    this.setState({editorText: content});
  }

  componentWillUnmount() {
    this.docSubscription.unsubscribe();
  }

  saveText() {
    const content = this.state.editorText;
    const size = new File([content], "").size;
    const file_name = this.state.docTitle;
    const body = JSON.stringify({ file_name, size, content })
    const url = `/api/documents/${this.docId}`;
    const headers = { 'Content-Type': 'application/json' }
    fetch(url, { method: 'PATCH', headers, body })
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText)
      }
      return res.json();
    }).then(json => console.log(json))
    .catch(error => console.log(error))
  }

  receiveEdit(data) {
    console.log(data)
    if (data.senderId === this.props.user.id) return;
    const editorDoc = this.editorRef.current.editor.session.doc;
    this.ensureCorrectRow(data)
    //this.ensureDeltaOrder(data);
    const newContent = editorDoc.getValue();

    this.setState({
      editorText: newContent,
      initialState: false
    })
  }

  updateSavedState(data) {
    if (data.admin_id === this.props.user.id) {
      this.props.dispatch({ type: UPDATE, doc: data.saved_state })
    } else {
      this.props.dispatch({ type: UPDATE_EDITABLE, doc: data.saved_state })
    }

    this.setState({ savedState: data.saved_state.content })
    console.log(data)
  }

  ensureCorrectRow(data) {
    this.pending.push(data);
    while (this.pending.length) {
      const editorDoc = this.editorRef.current.editor.session.doc;
      const data = this.pending.shift();
      this.broadcastChange = false;
      if (!this.deltaHistory.length) {
        editorDoc.applyDelta(data.changeData);
        this.deltaHistory.push(data)
        this.broadcastChange = true;
        return;
      }

      const lastDelta = this.deltaHistory.slice(-1)[0];
      // corrective conditions
      const diffOrigin = lastDelta.senderId !== data.senderId;
      const mistimed = lastDelta.time > data.time
      const higherIdx = data.changeData.start.row > lastDelta.changeData.start.row;
      if (diffOrigin && mistimed && higherIdx) {
        const lastDelta = this.deltaHistory.slice(-1)[0];
        const diff = lastDelta.changeData.lines.length - 1;
        switch(lastDelta.changeData.action) {
          case "insert":
            data.changeData.start.row += diff;
            data.changeData.end.row += diff;
            break;
          case "remove":
            data.changeData.start.row -= diff;
            data.changeData.end.row -= diff;
            break;
          default:
            break;
        }
      }
      editorDoc.applyDelta(data.changeData);
      this.deltaHistory.push(data)
    }
    
    this.broadcastChange = true;
  }

  editorListUpdate(data) {
    this.setState({editorList: data.editors })
  }

  ensureDeltaOrder(data) {
    this.broadcastChange = false;
    const editorDoc = this.editorRef.current.editor.session.doc;
    const popped = [];
    while (this.deltaHistory.length && this.deltaHistory.slice(-1)[0].time > data.time) {
      const prev = this.deltaHistory.pop();
      editorDoc.revertDelta(prev.changeData);
      popped.push(prev);
    }

    editorDoc.applyDelta(data.changeData);
    this.deltaHistory.push(data)

    while (popped.length) {
      const next = popped.pop();
      editorDoc.applyDelta(next.changeData);
      this.deltaHistory.push(next);
    }

    this.broadcastChange = true;
  }

  getCurrentRow(data) {
    if (data.senderId === this.props.user.id) return;

    // $(".ace_text-layer").find('div').css({backgroundColor: ""})
    // const rowElement = $(".ace_text-layer").find('div')[data.row]
    // if (rowElement) rowElement.style.backgroundColor = "rgba(255, 0, 0, 0.3)"
  }

  sendInitialPosition() {
    const row = this.editorRef.current.editor.getCursorPosition().row
    this.docSubscription.send({ senderId: this.props.user.id, row });
  }

  getEditorMode(fileName) {
    const fileExt = fileName.split(".").pop();
    switch(fileExt) {
      case "js":
        return "javascript"
      case "jsx":
        return "jsx"
      case "rb":
        return "ruby"
      case "java":
        return "java"
      case "py":
        return "python"
      case "php":
        return "php"
      case "cs":
        return "csharp"
      case "css":
        return "css"
      case "scss":
        return "sass"
      case "xml":
        return "xml"
      case "coffee":
        return "coffee"
      case "dart":
        return "dart"
      default:
        return "text"
    }
  }

  componentDidMount() {
    if (!this.state.initialState) return;
    const callbacks = {
      edit: this.receiveEdit.bind(this), 
      cursor: this.getCurrentRow.bind(this), 
      connect: this.sendInitialPosition.bind(this),
      editorList: this.editorListUpdate.bind(this),
      initialize: this.initializeDocument.bind(this),
      sendState: this.sendState.bind(this),
      syncState: this.syncState.bind(this),
      save: this.updateSavedState.bind(this)
    }

    this.docSubscription = connectToDoc(this.docId, true, callbacks);
  }

  initializeDocument(data) {
    const { content, file_name } = data.document;
    const mode = this.getEditorMode(file_name);
      this.setState({ 
        editorText: content, 
        editorMode: mode,
        docTitle: file_name,
        savedState: content
      })
  }

  sendState(data) {
    if (data.sender_id === this.props.user.id) return;
    this.docSubscription.send({
      senderId: this.props.user.id, 
      currentState: this.state
    })
  }

  syncState(data) {
    if (data.senderId === this.props.user.id) return;
    this.setState(() => data.currentState)
  }
  
  render() {
    if (!this.props.user) {
      this.docSubscription.unsubscribe();
      return <Redirect to="/"/>
    }

    const pendingChanges = this.state.editorText !== this.state.savedState;

    return (
    <div className="room">
      <NavContainer 
      saveText={this.saveText.bind(this)} 
      inRoom={true}
      pendingChanges={pendingChanges}
      />
      <div className="gray-area doc-room">
      <div className="doc-editor">
        <DocHeader 
          editors={this.state.editorList} 
          docTitle={this.state.docTitle}
        />
        <AceEditor
        onChange={this.broadcastEdit}
        height="90%"
        width="100%"
        mode={this.state.editorMode}
        theme="terminal"
        ref={this.editorRef}
        keyboardHandler="vscode"
        value={this.state.editorText}
        />
      </div>
      <ChatBox docId={this.docId} user={this.props.user}/>
      </div>
    </div>
    )
  }
}

export default withRouter(Room);