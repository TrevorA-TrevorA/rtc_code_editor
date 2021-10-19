import React, { useContext, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import Notification from './notification'
import { NotificationUtilities } from '../context/notification_utilities';

const NotificationsModal = props => {
  const { closeModal, closeNotifications } = useContext(NotificationUtilities);
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
      {notifications}
    </div>
  )
}

export default NotificationsModal;