import React from 'react';
import { v4 as uuid } from 'uuid';
import Notification from './notification'

const NotificationsModal = props => {
  const notifications = (
    props.notifications.map((notif) => {
    return <Notification key={uuid()}
    modal={true}
    notification={notif}/>
  }))
  
  return (
    <div className="notifications-modal">
      {notifications}
    </div>
  )
}

export default NotificationsModal;