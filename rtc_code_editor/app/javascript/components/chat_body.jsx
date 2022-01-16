import React from 'react';
import ChatBlock from './chat_block';
import { v4 as uuid } from 'uuid';

const ChatBody = (props) => {
  return (
    <div id="chatBody">
        {props.chatLog.map(chat => {
          return (
            <ChatBlock
            key={uuid()}
            user={chat.user} 
            message={chat.message}
            time={chat.time}/>
          )
        })}
    </div>
  )
}

export default ChatBody;