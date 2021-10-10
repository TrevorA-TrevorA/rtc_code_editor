import React from 'react';
import notificationsIcon from 'images/notifications-icon.png';
import connectToNotifications from '../channels/notifications_channel';
import NotificationsList from './notifications_list';
import { SendNotification } from '../context/send_notification';

class Notifications extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      unreadNotifications: [],
      readNotifications: [],
      viewing: false
    }

    this.closeListIfEmpty = this.closeListIfEmpty.bind(this);
    this.viewNotifications = this.viewNotifications.bind(this)
    this.closeNotifications = this.closeNotifications.bind(this)
    this.markAllAsRead = this.markAllAsRead.bind(this)
    this.subscription = connectToNotifications(this.props.user, this.receiveNotifications.bind(this));
    this.delist = this.delist.bind(this);
    window.notificationsSub = this.subscription;
    window.notifications = this;
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  delist(data) {
    const notifId = data.rescind ? data.rescind.id : data.id;
    const unread = this.state.unreadNotifications;
    const read = this.state.readNotifications;
    let notif = unread.find(notif => notif.id === notifId);
    if (notif) {
      unread.splice(unread.indexOf(notif), 1)
      this.setState({ unreadNotifications: unread })
    } else {
      notif = read.find(notif => notif.id === notifId);
      if (!notif) return;
      read.splice(unread.indexOf(notif), 1);
      this.setState({ readNotifications: read });
    }
    if (read.length + unread.length === 0) this.closeNotifications();
  }

  receiveNotifications(data) {
    if (data.rescind) {
      this.delist(data);
      return;
    }

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

  markAllAsRead() {
    const user_id = this.props.user.id;
    const url = `/api/users/${user_id}/notifications`
    const options = {
      method: "PATCH",
      headers: {
        'Content-Type': 'applicaton/json'
      }
    }

    fetch(url, options)
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText);
      } else {
        return res.json()
      }
    }).catch(error => console.log(error));
  }

  viewNotifications() {
    this.setState({ viewing: true })
    if (this.state.unreadNotifications.length) {
      this.markAllAsRead();
    }
  }

  closeListIfEmpty() {
    const unreadCount = this.state.unreadNotifications.length;
    const readCount = this.state.readNotifications.length;
    if (unreadCount + readCount === 1) {
      this.closeNotifications();
    }
  }

  closeNotifications() {
    const unread = this.state.unreadNotifications;
      let read = this.state.readNotifications;
      read = unread.concat(read);
      this.setState({
        unreadNotifications: [],
        readNotifications: read,
        viewing: false
      })
  }

  render() {
    const callback = this.state.viewing ? this.closeNotifications : this.viewNotifications
    const unread = this.state.unreadNotifications;
    const read = this.state.readNotifications;
    return(
      <SendNotification.Provider value={(n) => this.subscription.send(n)}>
      <div id="notifications">
        <div onClick={callback} className="notifications-icon-container">
        { 
          !unread.length || this.state.viewing ? null :
          <div className="notification-badge">{unread.length}</div> 
        }
        <img className="notifications-icon" src={notificationsIcon}/>
        </div>
        { 
        this.state.viewing ? 
        <NotificationsList 
        read={read} 
        unread={unread}
        closeListIfEmpty={this.closeListIfEmpty}
        delist={this.delist}
        closeList={this.closeNotifications}/> : 
        null 
        }
      </div>
      </SendNotification.Provider>
    )
  }
}

export default Notifications;