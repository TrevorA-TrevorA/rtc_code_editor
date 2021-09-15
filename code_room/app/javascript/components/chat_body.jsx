import React from 'react';
import ChatBubble from './chat_bubble';

const ChatBody = (props) => {
  return (
    <div id="chatBody">
        {props.chatLog.map(chat => {
          return (
            <ChatBubble 
            key={chat.time}
            user={chat.username} 
            message={chat.message}
            self={chat.uid === props.uid}
            time={chat.time}/>
          )
        })}
    </div>
  )
}

export default ChatBody;