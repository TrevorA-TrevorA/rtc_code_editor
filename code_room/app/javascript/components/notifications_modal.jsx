import React, { useContext, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import Notification from './notification'
import { NotificationUtilities } from '../context/notification_utilities';

const NotificationsModal = props => {
  const { closeModal, closeNotifications, clearAll } = useContext(NotificationUtilities);
  const notifications = (
    props.notifications.map((notif) => {
    return <Notification key={uuid()}
    modal={true}
    notification={notif}/>
  }))

  useEffect(() => {
    closeNotifications();
    
    $("body").on("click", (e) => {
      const interior = Array.from($(notificationsModal).find("*"));
      if (interior.includes(e.target)) return;
      closeModal();
    })

    return () => $("body").off("click");
  })
  
  return (
    <div id="notificationsModal" className="notifications-modal">
      <div className="notifications-modal-list">
        {notifications}
      </div>
      <div className="notification-buttons-container">
        <button onClick={clearAll} className="notification-button">clear all</button>
      </div>
    </div>
  )
}

export default NotificationsModal;