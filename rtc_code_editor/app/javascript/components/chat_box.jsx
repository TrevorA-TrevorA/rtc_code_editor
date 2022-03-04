import React from 'react';
import ChatBody from './chat_body';
import ChatBoxHeader from './chat_box_header';
import { Redirect } from 'react-router';

class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    this.sendChat = this.sendChat.bind(this);
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

  sendChat(e) {
    const message = e.currentTarget.value;
    if (!message) return;
    const options = { month: "numeric", day: "numeric", year: "numeric" }
    const time = new Date().toLocaleTimeString('en-US', options)

    this.props.send({ user: this.props.user, message, time })
    e.currentTarget.value = "";
  }

  render() {
    if (!this.props.user) {
      return <Redirect to="/"/>
    }

    return (
      <div id="chatBox">
        <ChatBoxHeader 
        headerMessage={this.props.headerMessage}
        headerMessageTime={this.props.headerMessageTime}
        />
        <ChatBody uid={this.props.user.id} chatLog={this.props.chatLog}/>
        <textarea id="chatInput" placeholder="Say something."></textarea>
        <div onClick={this.props.toggle} className='minimize-chat'>x</div>
      </div>
    )
  }
}

export default ChatBox;