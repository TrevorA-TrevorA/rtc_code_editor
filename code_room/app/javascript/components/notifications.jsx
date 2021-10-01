import React from 'react';
import notificationsIcon from 'images/notifications-icon.png';

class Notifications extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      unreadNotifications: [],
      readNotificatiosn: []
    }
  }

  render() {
    const unread = this.state.unreadNotifications;
    return(
      <div id="notifications">
        { !unread.length ? null : <div className="notification-badge">{unread.length}</div> }
        <img className="notifications-icon" src={notificationsIcon}/>
      </div>
    )
  }
}

export default Notifications;