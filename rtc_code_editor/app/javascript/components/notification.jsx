import React, { useContext } from 'react';
import CollabRequestContainer from '../containers/collab_request_container';
import closeButtonX from 'images/xgraphic.png';
import { NotificationUtilities } from '../context/notification_utilities';
import { v4 as uuid } from 'uuid';

const Notification = props => {
  const notification_type = props.notification.notification_type;
  let colorClass = !props.notification.read ? " unread" : "";

  const utilities = useContext(NotificationUtilities);
  const remove = (e) => {
    const notif = $(e.currentTarget).closest(".notification");
    $(notif).find("*").css({ opacity: 0 });
    $(notif).animate({height: 0, padding: "0px 15px"}, 300);
    setTimeout(() => utilities.removeNotification(props.notification), 300);
  }

  const notificationCloseButton = (
    <div onClick={remove} className="notification-close-button">
      <img src={closeButtonX}/>
    </div>
  )

  const revealCloseButton = (e) => {
    const button = $(e.currentTarget).find(".notification-close-button");
    button.css({ opacity: 0.7 });
  }

  const hideCloseButton = (e) => {
    const button = $(e.currentTarget).find(".notification-close-button");
    button.css({ opacity: 0 });
  }

  const modalClass = props.modal ? " modal" : ""

  switch(notification_type) {
    case "collaboration_request":
      return <CollabRequestContainer {...props}/>;
    case "collaboration_acceptance":
      return (
        <div className={"notification" + colorClass }
        onMouseEnter={revealCloseButton}
        onMouseOver={revealCloseButton}
        onMouseLeave={hideCloseButton}
        >
          {notificationCloseButton}
          {
          props.notification.details.message.split("\n").map((line, i, rows) => {
           const addedClass = i === rows.length - 1 ? "notification-message-file-name" : "";
           return <h4 key={uuid()} 
           className={"notification-message" + addedClass}>{line}</h4>
         })
         }
        </div>
      )
    default:
      return (
        <div className={"notification" + colorClass}
        onMouseEnter={revealCloseButton}
        onMouseOver={revealCloseButton}
        onMouseLeave={hideCloseButton}
        >
          {notificationCloseButton}
          {
            props.notification.details.message.split("\n").map(line => {
           return <h4 key={uuid()} className="notification-message">{line}</h4>
         })
         }
        </div>
      )
  }
}

export default Notification;