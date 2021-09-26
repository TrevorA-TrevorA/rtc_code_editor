import React from 'react';
import connectToChat from '../channels/chat_channel';
import ChatBody from './chat_body';
import ChatBoxHeader from './chat_box_header';
import { Redirect } from 'react-router';

class ChatBox extends React.Component {
  constructor(props) {
    super(props);

    const callbacks = [
      this.receiveChat.bind(this), 
      this.sendArrivalNotice.bind(this),
      this.sendExitNotice.bind(this),
      this.getHeaderMessage.bind(this)
    ]
    
    this.subscription = connectToChat(...callbacks);
    this.sendChat = this.sendChat.bind(this);
    this.state = { chatLog: [], headerMessage: "", headerMessageTime: null }
    window.subscription = this.subscription
  }

  receiveChat(chats) {
    this.setState({
      chatLog: chats,
    })
  }

  getHeaderMessage(data) {
    if (data.senderId === this.props.user.id) return;

    this.setState({ headerMessage: data.headerMessage, headerMessageTime: Date.now() });
  }

  componentDidMount() {
    const handleEnter = e => {
      if (e.code !== "Enter") return;
      e.preventDefault();
      this.sendChat(e);
    }

    const shiftDown = e => {
      if (e.code !== "ShiftLeft" || "ShiftRight") return;

      e.currentTarget.removeEventListener("keydown", handleEnter)
    }

    const shiftUp = e => {
      if (e.code !== "ShiftLeft" || "ShiftRight") return;

      e.currentTarget.addEventListener("keydown", handleEnter)
    }

    chatInput.addEventListener("keydown", handleEnter);
    chatInput.addEventListener("keydown", shiftDown);
    chatInput.addEventListener("keyup", shiftUp);
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  sendArrivalNotice() {
    const arrivalNotice = { 
      senderId: this.props.user.id,
      headerMessage: this.props.user.username + " has arrived.",
      arrival: true
    }

    this.subscription.send(arrivalNotice);
  }

  sendExitNotice() {
    const exitNotice = { 
      senderId: this.props.user.id, 
      headerMessage: this.props.user.username + " has exited.",
      exit: true
    }

    this.subscription.send(exitNotice);
  }

  sendChat(e) {
    const message = e.currentTarget.value;
    if (!message) return;
    const user = this.props.user;
    const options = { month: "numeric", day: "numeric", year: "numeric" }
    const time = new Date().toLocaleTimeString('en-US', options)

    this.subscription.send({ username: user.username, uid: user.id, message, time })
    e.currentTarget.value = "";
  }

  render() {
    if (!this.props.user) {
      return <Redirect to="/"/>
    }

    return (
      <div id="chatBox">
        <ChatBoxHeader 
        headerMessage={this.state.headerMessage}
        headerMessageTime={this.state.headerMessageTime}
        />
        <ChatBody uid={this.props.user.id} chatLog={this.state.chatLog}/>
        <textarea id="chatInput" placeholder="     Say something."></textarea>
      </div>
    )
  }
}

export default ChatBox;