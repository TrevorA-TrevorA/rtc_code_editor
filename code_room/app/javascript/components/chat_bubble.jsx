import React from 'react';

const ChatBubble = props => {
  const colorClass = props.self ? "self" : "other"
  return (
    <div className={"chat-bubble " + colorClass}>
      <p key="user">{props.user}</p>
      <p key="message">{props.message}</p>
      <p 
      className="time-stamp" 
      key="time">
      {props.time}
      </p>
    </div>
  )
}

export default ChatBubble;