import React from 'react';
import connectToChat from '../channels/chat_channel';
import ChatBody from './chat_body';

class ChatBox extends React.Component {
  constructor(props) {
    super(props)
    this.subscription = connectToChat(this.receiveChat.bind(this));
    this.sendChat = this.sendChat.bind(this);
    this.state = { chatLog: [] }
  }

  receiveChat(chats) {
    this.setState({
      chatLog: chats
    })
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
    const user = this.props.user;
    const options = { month: "numeric", day: "numeric", year: "numeric" }
    const time = new Date().toLocaleTimeString('en-US', options)

    this.subscription.send({ username: user.username, uid: user.id, message, time })
    e.currentTarget.value = "";
  }

  render() {
    return (
      <div id="chatBox">
        <div id="chatBoxHeader"></div>
        <ChatBody uid={this.props.user.id} chatLog={this.state.chatLog}/>
        <textarea id="chatInput"></textarea>
      </div>
    )
  }
}

export default ChatBox;