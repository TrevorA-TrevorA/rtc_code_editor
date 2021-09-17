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
        <p key="user">{this.props.user}</p>
        <p key="message">{this.props.message}</p>
        <p 
        className="time-stamp" 
        key="time">
        {this.props.time}
        </p>
      </div>
    )
  }
}

export default ChatBubble;