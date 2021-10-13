import React, { useEffect } from 'react';
import Notification from './notification';
import NotificationButtons from './notification_buttons';
import { v4 as uuid } from 'uuid';

const NotificationsList = props => {
  const { closeList } = props;
  const count = props.notifications.length;
  
  const notifications = (
        props.notifications.map((notif) => {
        const readStatus = notif.read;
        return <Notification key={uuid()} 
        read={readStatus}
        closeListIfEmpty={props.closeListIfEmpty}
        delist={props.delist}
        notification={notif}/>
      }))

  useEffect(() => {
    const notificationContent = Array.from($("#notifications").find("*"));
    $(document).on("click", (e) => {
      if (notificationContent.includes(e.target)) return;
      closeList();
    })

    if ($(".notification").length) {
      $(".notification").get(-1).style.borderBottom = "none";
    }

    return () => $(document).off("click");
  })

  return (
    <div className="notification-list">
      { notifications.slice(0,5) }
      { count > 1 ? <NotificationButtons count={count} /> : null }
    </div>
  )
}

export default NotificationsList;
