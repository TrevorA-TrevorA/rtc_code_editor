import React, { useEffect } from 'react';
import Notification from './notification';
import { v4 as uuid } from 'uuid';

const NotificationsList = props => {
  const { read, unread, closeList } = props;
  
  useEffect(() => {
    $(document).on("click", (e) => {
      if (Array.from($("#notifications").find("*")).includes(e.target)) return;
      closeList();
    })

    return () => $(document).off("click");
  })

  return (
    <div className="notification-list">
      { [unread, read].map(list => {
        return list.map((notif, _, arr) => {
          const readStatus = arr === read ? true : false;
          return <Notification key={uuid()} read={readStatus} notification={notif}/>
        })
      }) }
    </div>
  )
}

export default NotificationsList;
