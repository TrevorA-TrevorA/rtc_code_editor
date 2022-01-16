import React, { useContext } from 'react';
import { NotificationUtilities } from '../context/notification_utilities';

const NotificationButtons = props => {
  const { clearAll, openModal } = useContext(NotificationUtilities);
  
  return (
    <div className="notification-buttons-container">
      <button onClick={clearAll} className="notification-button">clear all</button>
      { 
        props.count > 4 ?
        <button onClick={openModal} className="notification-button">view all</button> :
        null
      }
    </div>
  )
}

export default NotificationButtons;