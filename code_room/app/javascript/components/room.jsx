import React from 'react';
import connectToDoc from '../channels/doc_channel';
import NavContainer from '../containers/nav_container'
import AceEditor from 'react-ace';
import ChatBox from './chat_box';
import "ace-builds";
import "ace-builds/webpack-resolver";
import { withRouter } from 'react-router-dom';

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.getEditorMode = this.getEditorMode.bind(this);
    this.state = { 
      editorText: "",
      editorMode: "javascript",
      initialState: true,
    }

    this.receiveEdit = this.receiveEdit.bind(this);
    this.broadcastEdit = this.broadcastEdit.bind(this);
    this.docSubscription = connectToDoc(this.receiveEdit.bind(this));
    this.editorRef = React.createRef();
    this.updateCursor = this.updateCursor.bind(this);
    this.getTotalLines = this.getTotalLines.bind(this);
    this.activeLineIndex = 0;
    this.totalLines = 0;
    window.room = this;
  }

  getTotalLines() {
    return this.editorRef.current.editor.session.doc.$lines.length;
  }

  broadcastEdit(content) {
    this.docSubscription.send({
      changeIndex: this.activeLineIndex, 
      senderId: this.props.user.id,
      message: content
    });
    
    this.setState({editorText: content});
  }

  receiveEdit(data) {
    if (data.senderId === this.props.user.id) return;
    const { column } = this.editorRef.current.editor.getCursorPosition()
    this.setState({
      editorText: data.message,
      initialState: false
    })

    this.compensateCursor(data, column)
    this.totalLines = this.getTotalLines();
  }

  compensateCursor(data, column) {
    if (data.senderId === this.props.user.id) return;
    if (data.changeIndex > this.activeLineIndex) return;
    const lines = data.message.split("\n")
    const newLineCount = lines.length;
    const delta = newLineCount - this.totalLines;
    const newRow = this.activeLineIndex + delta;
    this.editorRef.current.editor.moveCursorTo(newRow, column)
  }

  updateCursor() {
    const newIndex = this.editorRef.current.editor.getCursorPosition().row;
    this.activeLineIndex = newIndex
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

    const docId = this.props.match.params.docId;
    const url = `/api/documents/${docId}`;
    fetch(url).then(res => {
      if (!res.ok) {
        throw new Error(res.statusText);
      } else {
        return res.json();
      }
    }).then(json => {
      const content = json.content;
      const mode = this.getEditorMode(json.file_name);
      this.setState({ editorText: "\n" + content, editorMode: mode })
      this.totalLines = this.getTotalLines();
    }).catch(err => console.log(err))
  }
  
  render() {
    return (
    <div className="room">
      <NavContainer/>
      <div className="gray-area doc-room">
      <AceEditor
      onChange={this.broadcastEdit}
      onCursorChange={this.updateCursor}
      height="37.708333333333336vw"
      width="55.46875vw"
      mode={this.state.editorMode}
      theme="terminal"
      ref={this.editorRef}
      keyboardHandler="vscode"
      value={this.state.editorText}
      />
      <ChatBox user={this.props.user}/>
      </div>
    </div>
    )
  }
}

export default withRouter(Room);