import React, { useContext, useEffect } from 'react';
import { GravatarUrl } from '../context/gravatar_url';

const ChatBlock = props => {
  const gravatar = useContext(GravatarUrl);
  const imgurl = props.user.avatar_url || gravatar(props.user.email)
  let time;
  if (new Date(props.time).getDate() === new Date().getDate()) {
    time = new Date(props.time).toLocaleTimeString("en-US", {timeStyle: "short"})
  } else {
    time = new Date(props.time).toLocaleDateString();
  }

  
  useEffect(() => chatBody.scrollTop = chatBody.scrollHeight);
  

  return (
    <div className="chatblock">
      <img src={imgurl} className="avatar chat"/>
      <div className="chat-text">
        <div className="chat-name-time">
          <p className="chat-username">{props.user.username}</p>
          <p className="timestamp">{time}</p>
        </div>
        <p className="chat-message">{props.message}</p>
      </div>
    </div>
  )
}

export default ChatBlock;