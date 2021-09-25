import React from 'react';

class ChatBubble extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  render() {
    const colorClass = this.props.self ? "self" : "other"
    return (
      <div className={"chat-bubble " + colorClass}>
        <div className="chat-name-time-row">
        <p key="user" className="chat-user-name">{this.props.user}</p>
        <p 
        className="chat-time-stamp" 
        key="time">
        {new Date(this.props.time).toLocaleTimeString("en-US", {timeStyle: "short"})}
        </p>
        </div>
        <p key="message">{this.props.message}</p>
        
      </div>
    )
  }
}

export default ChatBubble;