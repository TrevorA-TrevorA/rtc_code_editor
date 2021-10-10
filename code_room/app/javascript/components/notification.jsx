import React from 'react';
import CollabRequestContainer from '../containers/collab_request_container';
import { v4 as uuid } from 'uuid';

const Notification = props => {
  const notification_type = props.notification.notification_type;

  switch(notification_type) {
    case "collaboration_request":
      return <CollabRequestContainer {...props}/>;
    default:
      const colorClass = !props.read ? " unread" : "";

      return (
        <div className={"notification" + colorClass}>
         {props.notification.details.message.split("\n").map( line => {
           return <h4 key={uuid()} className="notification-message">{line}</h4>
         })
         }
        </div>
      )
  }
}

export default Notification;