import React, { useEffect, useContext } from 'react';
import Notification from './notification';
import NotificationButtons from './notification_buttons';
import { v4 as uuid } from 'uuid';
import { NotificationUtilities } from '../context/notification_utilities';

const NotificationsList = props => {
  const { closeNotifications } = useContext(NotificationUtilities)
  const count = props.notifications.length;
  
  const notifications = (
        props.notifications.map((notif) => {
        return <Notification key={uuid()}
        modal={false}
        notification={notif}/>
      }))

  useEffect(() => {
    const notificationContent = Array.from($("#notifications").find("*"));
    $(document).on("click", (e) => {
      if (notificationContent.includes(e.target)) return;
      closeNotifications();
    })

    
    if ($(".notification").length) {
      const first = $(".notification-list").find(".notification").get(0);
      const last = $(".notification-list").find(".notification").get(-1);

      $(first).css({
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px"
      });

      $(last).css({
        borderBottomLeftRadius: "10px",
        borderBottomRightRadius: "10px",
        border: "none"
      })
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
