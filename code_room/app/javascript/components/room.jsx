import React from 'react';
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
      editorMode: "javascript"
    }
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
    }).catch(err => console.log(err))
  }
  
  render() {
    return (
    <div className="room">
      <NavContainer/>
      <div className="gray-area doc-room">
      <AceEditor
      height="37.708333333333336vw"
      width="55.46875vw"
      mode={this.state.editorMode}
      theme="terminal"
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