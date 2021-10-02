import React from 'react';
import notificationsIcon from 'images/notifications-icon.png';
import connectToNotifications from '../channels/notifications_channel';
import Notification from './notification';
import { v4 as uuid } from 'uuid';

class Notifications extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      unreadNotifications: [],
      readNotifications: [],
      viewing: false
    }
    
    this.subscription = connectToNotifications(this.props.user, this.receiveNotifications.bind(this));
    window.notificationsSub = this.subscription;
    window.notifications = this;
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  receiveNotifications(data) {
    if (data.new_notification) {
      const unread = this.state.unreadNotifications;
      unread.unshift(data.new_notification)
      this.setState({ unreadNotifications: unread })
      return;
    }

    const read = [];
    const unread = [];
    data.notifications.forEach(not => {
      not.read ? read.push(not) : unread.push(not);
    });

    [read, unread].forEach(notList => {
      if (!notList.length) return;
      notList.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    });

    this.setState({
      readNotifications: read,
      unreadNotifications: unread
    })
  }

  viewNotifications() {
    this.setState({ viewing: true })
    setTimeout(() => {
      const unread = this.state.unreadNotifications;
      let read = this.state.readNotifications;
      read = unread.concat(read);
      this.setState({
        unreadNotifications: [],
        readNotifications: read
      })
    }, 1000)
  }

  render() {
    const unread = this.state.unreadNotifications;
    const read = this.state.readNotifications;
    return(
      <div id="notifications">
        { 
          !unread.length || this.state.viewing ? null :
          <div className="notification-badge">{unread.length}</div> 
        }
        <img className="notifications-icon" src={notificationsIcon}/>
        { this.state.viewing ?
          <div className="notification-list">
          { [unread, read].map(list => {
            return list.map((notif, _, arr) => {
              const readStatus = arr === read ? true : false;
              return <Notification key={uuid()} read={readStatus} notification={notif}/>
            })
          }) }
        </div> :
        null
        }
      </div>
    )
  }
}

export default Notifications;