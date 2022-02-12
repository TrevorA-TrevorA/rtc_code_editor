import React from 'react';
import chatIcon from 'images/chat-icon.png';

const ChatToggle = props => {
  return (
    <div id='chat-toggle' onClick={props.toggle}>
      { 
        !!props.unreadChats ?
        <div className="notification-badge">{props.unreadChats}</div> :
        null
      }
    <img src={chatIcon}/>
    </div>
  )
}

export default ChatToggle;