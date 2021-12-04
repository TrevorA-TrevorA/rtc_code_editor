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
import { v4 as uuid } from 'uuid';

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
    this.localPeers = {};
    this.dataChannels = {};
    this.backupConnection = true
    this.deltaMap = {}
    window.room = this;
  }

  broadcastEdit(content, event) {
    const time = Date.now();
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
      deltaId: uuid(),
      senderId: this.props.user.id,
      changeData: event,
      currentLine,
      currentContent: content
    }
    
    this.docSubscription.send({backup: delta})

    Object.values(this.dataChannels).forEach(channel => {
      if (channel.readyState === "open") channel.send(JSON.stringify(delta));
    });

    this.localDeltaHistory.push(delta);
    this.deltaHistory.push(delta);
    this.setState({editorText: content});
  }

  componentWillUnmount() {
    this.docSubscription.unsubscribe();
    Object.values(this.dataChannels).forEach(channel => channel.close())
    Object.values(this.localPeers).forEach(peer => peer.close())
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

  mapRecentDeltas(data) {
    this.deltaMap[data.deltaId] = data

    setTimeout(() => {
      delete this.deltaMap[data.deltaId]
    }, 5000)
  }

  receiveEdit(editData) {
    window.latestChange = editData;
    if (!editData.backup && this.backupConnection) return;
    let data = editData.backup ? editData.backup : JSON.parse(editData.data);
    if (this.deltaMap[data.deltaId]) return;
    if (data.senderId === this.props.user.id) return;
    this.mapRecentDeltas(data);
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
      save: this.updateSavedState.bind(this),
      initConnection: this.connectDataChannel.bind(this),
    }

    this.docSubscription = connectToDoc(this.docId, true, callbacks, this.props.user.id);
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

  async connectDataChannel(data) {  
    if (!data.join && data.recipientId !== this.props.user.id) return;
    console.log(data)

    const config = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
    if (!this.localPeers[data.senderId]) {
      console.log("creating new peer")
      this.localPeers[data.senderId] = new RTCPeerConnection(config);
    }
    const connection = this.localPeers[data.senderId];
    connection.ondatachannel = e => {
      console.log("ondatachannel event triggered")
      const dataChannel = e.channel;
      dataChannel.onmessage = message => this.receiveEdit(message)
      dataChannel.onopen = () => {
        console.log("open");
        this.backupConnection = !this.dataChannelsConnected()
      }
      dataChannel.onclose = () => {
        this.backupConnection = !this.dataChannelsConnected();
        console.log("closing datachannel")
        delete this.localPeers[data.senderId]
        delete this.dataChannels[data.senderId]
      }
      this.dataChannels[data.senderId] = dataChannel;
    }

    connection.onicecandidate = e => {
      if (!e.candidate) return;
      this.docSubscription.send({ 
        iceCandidate: e.candidate,
        senderId: this.props.user.id,
        recipientId: data.senderId
      })
    }

    connection.onconnectionstatechange = () => {
      if (Object.values(this.localPeers).every(conn => conn.connectionState === 'connected')) {
        this.backupConnection = false;
        console.log("peers connected")
      }  else  {
        this.backupConnection = true;
      }
    }

    connection.oniceconnectionstatechange = async () => {
      if (["disconnected", "failed"].includes(connection.iceConnectionState)) {
        connection.restartIce();

        if (connection.localDescription === "offer") {
          const newOffer = await connection.createOffer()
          connection.setLocalDescription(newOffer)
        }
      }
    }

    if (data.join) {
      const dataChannel = connection.createDataChannel(this.docId);
      dataChannel.onopen = () => {
        console.log("open");
       this.backupConnection = !this.dataChannelsConnected();
      }
      dataChannel.onclose = () => {
        this.backupConnection = !this.dataChannelsConnected();
        console.log("closing data channel")
        delete this.localPeers[data.senderId]
        delete this.dataChannels[data.senderId]
      }
      dataChannel.onmessage = message => this.receiveEdit(message)
      try {
      const offer = await connection.createOffer();
      await connection.setLocalDescription(offer);
      this.dataChannels[data.senderId] = dataChannel;
      this.docSubscription.send({ 
        offer: offer,
        senderId: this.props.user.id,
        recipientId: data.senderId
      })
    } catch(error) {
        console.log(error);
      }
    }

    if (data.offer) {
      try {
      await connection.setRemoteDescription(data.offer);
      const answer = await connection.createAnswer();
      await connection.setLocalDescription(answer);
      this.docSubscription.send({
        answer: answer,
        senderId: this.props.user.id,
        recipientId: data.senderId
      })
        } catch(error) {
        console.log(error)
      }
    }

    if (data.answer) {
      try {
        await connection.setRemoteDescription(data.answer);
      } catch(error) {
        console.log(error);
      }
    }

    if (data.iceCandidate) {
      connection.addIceCandidate(data.iceCandidate)
      .catch(error => {
        console.log(error);
      })
    }
  }

  dataChannelsConnected() {
    const channels = Object.values(this.dataChannels);
    const allPresent = channels.length === this.state.editorList.length - 1;
    const allOpen = channels.every(channel => channel.readyState === "open")
    return allPresent && allOpen;
  }

  syncState(data) {
    if (data.senderId === this.props.user.id) return;
    const { editorMode, editorText, docTitle, savedState } = data.currentState;
    this.setState({ editorMode, editorText, docTitle, savedState })
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