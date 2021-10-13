import React, { useEffect } from 'react';
import CollabRequestContainer from '../containers/collab_request_container';
import { v4 as uuid } from 'uuid';

const Notification = props => {
  const notification_type = props.notification.notification_type;
  let colorClass = !props.read ? " unread" : "";

  switch(notification_type) {
    case "collaboration_request":
      return <CollabRequestContainer {...props}/>;
    case "collaboration_acceptance":
      return (
        <div className={"notification" + colorClass}>
         {props.notification.details.message.split("\n").map((line, i, rows) => {
           const addedClass = i === rows.length - 1 ? "file_name" : "";
           return <h4 key={uuid()} 
           className={"notification-message" + addedClass}>{line}</h4>
         })
         }
        </div>
      )
    default:
      return (
        <div className={"notification" + colorClass}>
         {props.notification.details.message.split("\n").map(line => {
           return <h4 key={uuid()} className="notification-message">{line}</h4>
         })
         }
        </div>
      )
  }
}

export default Notification;