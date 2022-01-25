import React from 'react';
import connectToDoc from '../channels/doc_channel';
import NavContainer from '../containers/nav_container'
import AceEditor from 'react-ace';
import ChatBox from './chat_box';
import DocHeader from './doc_header'
import RevocationNotice from './revocation_notice';
import "ace-builds";
import "ace-builds/webpack-resolver";
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import { UPDATE } from '../reducers/doc_reducer'
import { UPDATE_EDITABLE } from '../reducers/collab_reducer'
import { v4 as uuid } from 'uuid';
import { sha1 } from 'object-hash';
import { compoundExtensions, modeMap } from "../language_modes";
window.modeMap = modeMap;
window.sha1 = sha1;

class Room extends React.Component {
  constructor(props) {
    super(props);
    if (this.revokeAccess) return;
    this.getEditorMode = this.getEditorMode.bind(this);
    this.docId = this.props.match.params.docId;
    const { documents, editables } = this.props;
    this.doc = documents.concat(editables)
    .find(doc => doc.id === this.docId)

    if (!this.doc) {
      this.state = { authorized: false }
      return;
    }

    const defaultState = this.doc.content
    const fileName = this.doc.file_name;
    const mode = this.getEditorMode(fileName);

    this.state = { 
      editorText: defaultState,
      editorMode: mode,
      initialState: true,
      docTitle: fileName,
      editorList: [],
      savedState: defaultState,
      authorized: true,
      revokeAccess: false
    }

    this.receiveEdit = this.receiveEdit.bind(this);
    this.broadcastEdit = this.broadcastEdit.bind(this);
    this.saveOnCtrlS = this.saveOnCtrlS.bind(this);
    this.renderLocation = this.renderLocation.bind(this);
    this.editorRef = React.createRef();
    this.broadcastChange = true;
    this.pending = [];
    this.docSubscription;
    this.localPeers = {};
    this.dataChannels = {};
    this.backupConnection = true
    this.deltaMap = {}
    this.docMap = {}
    this.mapRows = this.mapRows.bind(this);
    this.processingDeltas = false;
    this.lines = [];
    this.senderIdQueue = [];
    this.lastDeltaByUser = {};
    this.lastLineCountChange = {}
    this.userActivity = []
    this.userPositions = {}
    this.nameTagColors = {};
    this.nameTagColorList = ['#FF0000', '#0096FF', '#19AD49', '#FF00FF', '#FFA500'];
    window.room = this;
  }

  broadcastEdit(content, event) {
    const time = Date.now();
    if (!this.broadcastChange) return;
    let currentLine = this.lines[event.start.row]
    const key = sha1(currentLine);
    let subkey;
    let dupIndex;
    let dupCount;
    let activityIndices = this.docMap[key][this.props.user.id];
    if (activityIndices && activityIndices.includes(event.start.row)) {
      dupIndex = this.docMap[key][this.props.user.id].indexOf(event.start.row);
      dupCount = this.docMap[key][this.props.user.id].length;
      subkey = this.props.user.id;
    } else {
      dupIndex = this.docMap[key].all.indexOf(event.start.row);
      dupCount = this.docMap[key].all.length;
      subkey = "all";
    }
    const delta = {
      subkey,
      dupCount,
      dupIndex,
      time,
      deltaId: uuid(),
      senderName: this.props.user.username,
      senderId: this.props.user.id,
      changeData: event,
      currentLine,
      currentContent: content,
    }
    
    this.sendUpdate(delta);

    this.lastDeltaByUser[this.props.user.id] = delta;
    if (this.senderIdQueue.slice(-1)[0] !== this.props.user.id) {
      this.senderIdQueue.push(this.props.user.id)
    }

    if (this.senderIdQueue.length > 3) {
      this.senderIdQueue = this.senderIdQueue.slice(-3)
    }

    this.updateUserActivity(delta)
    if (event.lines.length > 1) {
      this.lastLineCountChange[this.props.user.id] = { time: delta.time, index: event.start.row }
    }
    this.setState({editorText: content});
  }

  updateCursorPos(pos) {
    const { row, column } = pos.cursor;
    this.userPositions[this.props.user.id] = { row, column, name: this.props.user.username };

    this.sendUpdate({
      position: this.userPositions[this.props.user.id],
      senderId: this.props.user.id,
      senderName: this.props.user.username
    });
  }

  renderLocation(row, col, username, userId) {
    if (userId === this.props.user.id) return;
    const left = col * 7 + 52 + col/5;
    const top = row * 16 - this.editorRef.current.editor.session.$scrollTop;
    const nameTagColor = this.nameTagColors[userId]

    const userLocationClass = `${username.replaceAll(/ /g, "_")}_location`
    $(`.${userLocationClass}`).remove();
    const locationMarker = $('<div></div>');
    locationMarker.css({
      position: 'absolute',
      width: '2px',
      height: '16px',
      backgroundColor: nameTagColor,
      top,
      left
    })

    const nameTag = $(`<div>${username}</div>`);
    nameTag.css({
      position: 'absolute',
      [!row ? 'bottom' : 'top']: '-16px',
      padding: '2px 5px',
      border: `2px solid ${nameTagColor}`,
      left: '0',
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      backgroundColor: 'rgb(32,32,32)',
      fontSize: '10px',
      borderRadius: '3px',
      pointerEvents: 'none'
    })

    locationMarker.append(nameTag);

    locationMarker.addClass(userLocationClass);
    $('#ace-editor').append(locationMarker[0]);
  }

  saveOnCtrlS() {
    const editor = document.getElementById("ace-editor")
    editor.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.code === "KeyS") {
        e.preventDefault();
        this.saveText();
      }
    })
  }

  componentDidUpdate() {
    if (!this.state.authorized || this.state.revokeAccess || !this.props.user) return;
    this.mapRows();
    const lines = this.editorRef.current.editor.session.doc.$lines;
    this.lines = JSON.parse(JSON.stringify(lines));
  }

  componentWillUnmount() {
    if (this.docSubscription) {
      this.docSubscription.unsubscribe();
      Object.values(this.dataChannels).forEach(channel => channel.close())
      Object.values(this.localPeers).forEach(peer => peer.close())
    }
  }

  sendUpdate(delta) {
    this.docSubscription.send({backup: delta})

    Object.values(this.dataChannels).forEach(channel => {
      if (channel.readyState === "open") channel.send(JSON.stringify(delta));
    });
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
    if (!window.latestChange) window.latestChange = [];
    window.latestChange.push(editData)
    if (window.latestChange.length > 2) window.latestChange = window.latestChange.slice(-2)
    if (!editData.backup && this.backupConnection) return;
    let data = editData.backup || editData;
    if (this.deltaMap[data.deltaId]) return;
    if (data.senderId === this.props.user.id) return;
    this.mapRecentDeltas(data);
    const editorDoc = this.editorRef.current.editor.session.doc;
    this.ensureCorrectRow(data);
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

  locateLine(delta) {
    console.log("locateLine", delta.senderId)
    const key = sha1(delta.currentLine);
    try {
      let subkey = delta.subkey;
      const localCount = this.docMap[key][subkey].length;
      console.log("subkey:", subkey)
      console.log("currentIndex:", delta.changeData.start.row)
      console.log("selectedIndex:", this.docMap[key][subkey][delta.dupIndex])
      console.log("Indices for this line:", this.docMap[key][subkey])
      console.log("localCount:", localCount)
      console.log("delta.dupCount:", delta.dupCount)
      if (localCount === delta.dupCount) {
        return this.docMap[key][subkey][delta.dupIndex];
      }

      if (delta.dupIndex >= localCount) {
        return delta.changeData.start.row
      }

      if (delta.dupCount > localCount) {
        return this.docMap[key][subkey][delta.dupIndex];
      }

      const diff = localCount - delta.dupCount;
      return this.docMap[key][subkey][delta.dupIndex + diff];
    } catch(err) {
      console.log("currentLine:", delta.currentLine)
      return delta.changeData.start.row;
    }
  }

  ensureCorrectRow(newData) {
    console.log("ensureCorrectRow called", Date.now(), newData)
    this.pending.push(newData);
    this.pending.sort((a,b) => a.time - b.time)
    if (this.processingDeltas) return;
    while (this.pending.length) {
      this.processingDeltas = true;
      const editorDoc = this.editorRef.current.editor.session.doc;
      const data = this.pending.shift();
      this.broadcastChange = false;

      const noDeltas = !this.senderIdQueue.length;
      const onlyCurrentSender = this.senderIdQueue.length === 1 && 
      this.senderIdQueue[0] === data.senderId;

      if (noDeltas || onlyCurrentSender) {
        console.log("not adjusted", JSON.parse(JSON.stringify(data)))
        editorDoc.applyDelta(data.changeData);
        const { row, column } = this.userPositions[data.senderId];
        this.renderLocation(row, column, data.senderName, data.senderId);
        if (data.changeData.lines.length > 1) {
          this.lastLineCountChange[data.senderId] = { time: data.time, index: data.changeData.start.row }
        }
        this.updateUserActivity(data)
        this.lastDeltaByUser[data.senderId] = data;
        if (this.senderIdQueue.slice(-1)[0] !== data.senderId) {
          this.senderIdQueue.push(data.senderId)
        }

        if (this.senderIdQueue.length > 3) {
          this.senderIdQueue = this.senderIdQueue.slice(-3)
        }

        this.processingDeltas = false;
        this.broadcastChange = true;
        return;
      }

      let diff = 0;
      if (this.adjustmentNeeded(data)) {
        console.log("adjusted:", JSON.parse(JSON.stringify(data)))
        const newRow = this.locateLine(data)
        console.log("newRow:", newRow);
        diff = newRow - data.changeData.start.row;
        data.changeData.start.row = newRow;
        data.changeData.end.row = newRow + (data.changeData.lines.length - 1)
      }
      console.log("AboutToApplyDelta:", data)
      editorDoc.applyDelta(data.changeData);
      const { row, column } = this.userPositions[data.senderId];
      this.renderLocation(row + diff, column, data.senderName, data.senderId);

      if (data.changeData.lines.length > 1) {
        this.lastLineCountChange[data.senderId] = { time: data.time, index: data.changeData.start.row }
      }

      this.updateUserActivity(data)
      this.lastDeltaByUser[data.senderId] = data;

      if (this.senderIdQueue.slice(-1)[0] !== data.senderId) {
        this.senderIdQueue.push(data.senderId)
      }

      if (this.senderIdQueue.length > 3) {
        this.senderIdQueue = this.senderIdQueue.slice(-3)
      }
   }
    
    this.processingDeltas = false;
    this.broadcastChange = true;
  }

  getCursorPosition() {
    return this.editorRef.current.editor.getCursorPosition()
  }

  editorListUpdate(data) {
    this.setState({editorList: data.editors })
  }

  updateUserActivity(data) {
    const docLines = this.editorRef.current.editor.session.doc.$lines
    
    const { senderId, changeData } = data;
    if (changeData.lines.length === 1) {
      const hash = sha1(docLines[changeData.start.row])
      this.userActivity[changeData.start.row] = { [hash]: senderId};
      return;
    }

    const startIdx = changeData.start.row;
    const startEntry = { [sha1(docLines[startIdx])]: senderId }
    this.userActivity[startIdx] = startEntry;

    switch(changeData.action) {
      case "insert":
        const newLineCount = changeData.lines.length - 1;
        const newLines = []
        for (let i = 1; i <= newLineCount; i++) {
          newLines.push(docLines[startIdx + i])
        }
        
        const newEntries = newLines.map(line => ({ [sha1(line)]: senderId }))
        this.userActivity.splice(startIdx + 1, 0, ...newEntries)
        return;
      case "remove":
        const diff = changeData.lines.length - 1;
        this.userActivity.splice(startIdx + 1, diff);
        return;
    }
  }

  sendInitialPosition() {
    const pos = this.editorRef.current.editor.getCursorPosition()
    this.updateCursorPos({cursor: pos});
  }

  adjustmentNeeded(delta) {
    for ( let [user, data]  of Object.entries(this.lastLineCountChange)) {
      if (user === delta.senderId) continue;
      let { time, index } = data;
      if (delta.time - time < 1000 && index < delta.changeData.start.row) {
        return true;
      }
    }
    return false;
  }

  getEditorMode(fileName) {
    let fileExt;
    const fileSegments = fileName.split(".");
    if (compoundExtensions.some(ext => ext.test(fileName))) {
      fileExt = fileSegments.slice(-2).join(".")
    } else {
      fileExt = fileSegments.pop();
    }
    
    const mode = modeMap.get(fileExt) || "text";
    return mode
  }

  componentDidMount() {
    const editor = this.editorRef.current.editor;
    if (!this.state.initialState) return;
    if (!this.state.authorized) return;
    this.lines = JSON.parse(JSON.stringify(editor.session.doc.$lines));
    this.saveOnCtrlS();
    const callbacks = {
      edit: this.receiveEdit.bind(this), 
      cursor: this.setUserPosition.bind(this), 
      connect: this.sendInitialPosition.bind(this),
      editorList: this.editorListUpdate.bind(this),
      initialize: this.initializeDocument.bind(this),
      sendState: this.sendState.bind(this),
      syncState: this.syncState.bind(this),
      save: this.updateSavedState.bind(this),
      ejectUser: this.ejectUser.bind(this),
      assignColor: this.assignColor.bind(this),
      initConnection: this.connectDataChannel.bind(this),
    }
    this.userActivity = this.editorRef.current.editor.session.doc.$lines.map(line => {
      return { [sha1(line)]: null }
    })
    this.docSubscription = connectToDoc(this.docId, true, callbacks, this.props.user.id);
  }

  ejectUser() {
    this.setState({revokeAccess: true})
  }

  initializeDocument(data) {
    const { content, file_name } = data.document;
    const mode = this.getEditorMode(file_name);
      this.setState({ 
        editorText: content, 
        editorMode: mode,
        docTitle: file_name,
        savedState: content
      }, this.mapRows)
  }

  mapRows = () => {
    this.docMap = {}
    for (let i = 0; i < this.userActivity.length; i++) {
      const entry = this.userActivity[i]
      const key = Object.keys(entry)[0];
      const userId = entry[key];
      if (!this.docMap[key]) this.docMap[key] = {};
      if (!this.docMap[key]["all"]) this.docMap[key]["all"] = [];
      if (!this.docMap[key][userId] && userId) this.docMap[key][userId] = [];
      if (!userId) {
        if (!this.docMap[key].default) this.docMap[key].default = [];
        this.docMap[key].default.push(i)
      }
      if (this.docMap[key][userId]) this.docMap[key][userId].push(i);
      this.docMap[key]["all"].push(i);
    }
  }

  sendState(data) {
    if (data.sender_id === this.props.user.id) return;
    this.docSubscription.send({
      senderId: this.props.user.id,
      currentState: this.state,
      userActivity: this.userActivity,
      senderPosition: this.userPositions[this.props.user.id],
      senderName: this.props.user.username,
    })
  }

  assignColor(data) {
    if (data.exit) {
      $(`.${data.senderName.replaceAll(/ /g, "_")}_location`).remove();
      delete this.nameTagColors[data.senderId];
      return;
    }

    if (this.nameTagColors[data.senderId]) return;
    const colorIndex = Object.keys(this.nameTagColors).length % 5;
    console.log(this.nameTagColorList[colorIndex]);
    this.nameTagColors[data.senderId] = this.nameTagColorList[colorIndex];
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
      dataChannel.onmessage = message => {
        let data = JSON.parse(message.data);
        data.position ?
        this.setUserPosition(data) :
        this.receiveEdit(data);
      }
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
      dataChannel.onmessage = message => {
        let data = JSON.parse(message.data);
        data.position ?
        this.setUserPosition(data) :
        this.receiveEdit(data);
      }
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


  setUserPosition(pos) {
    const { senderId, position, senderName } = pos.backup || pos;
    if (senderId === this.props.user.id) return;
    this.userPositions[senderId] = { ...position, name: senderName };
    const { row, column } = position;
    this.renderLocation(row, column, senderName, senderId);
  }

  syncState(data) {
    if (data.senderId === this.props.user.id) return;
    this.assignColor(data);
    const { senderName, senderPosition, senderId } = data;
    const { row, column } = senderPosition;
    this.userPositions[senderId] = { ...senderPosition, name: senderName };
    const { editorMode,
        editorText, 
        docTitle, 
        savedState } = data.currentState;

    this.userActivity = data.userActivity;
    this.setState({ editorMode, editorText, docTitle, savedState }, () => {
      this.renderLocation(row, column, senderName, senderId);
    })
  }
  
  render() {
    if (!this.props.user) {
      this.docSubscription.unsubscribe();
      return <Redirect to="/"/>
    }

    if (!this.state.authorized) {
      return <Redirect to="/dash"/>
    }

    const { user } = this.props;

    const pendingChanges = this.state.editorText !== this.state.savedState;

    return (
    <div className="room">
      <NavContainer 
      saveText={this.saveText.bind(this)} 
      inRoom={true}
      pendingChanges={pendingChanges}
      />
      {
        this.state.revokeAccess ?
        <RevocationNotice fileName={this.state.docTitle}/> :
        <div className="gray-area doc-room">
        <div className="doc-editor">
        <DocHeader 
          editors={this.state.editorList} 
          docTitle={this.state.docTitle}
        />
        <AceEditor
        onChange={this.broadcastEdit}
        onCursorChange={this.updateCursorPos.bind(this)}
        onScroll={() => {
          for (let [id, pos] of Object.entries(this.userPositions)) {
            const { row, column, name } = pos;
            this.renderLocation(row, column, name, id);
          }
        }}
        height="90%"
        width="100%"
        mode={this.state.editorMode}
        theme="tomorrow_night_blue"
        ref={this.editorRef}
        keyboardHandler="vscode"
        value={this.state.editorText}
        />
      </div>
      <ChatBox docId={this.docId} user={user}/>
      </div>
      }
    </div>
    )
  }
}

export default withRouter(Room);