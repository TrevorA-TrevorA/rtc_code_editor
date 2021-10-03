import React from 'react';
import notificationsIcon from 'images/notifications-icon.png';
import connectToNotifications from '../channels/notifications_channel';
import NotificationsList from './notifications_list';

class Notifications extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      unreadNotifications: [],
      readNotifications: [],
      viewing: false
    }
    this.viewNotifications = this.viewNotifications.bind(this)
    this.closeNotifications = this.closeNotifications.bind(this)
    this.markAllAsRead = this.markAllAsRead.bind(this)
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
      <div onClick={callback} id="notifications">
        { 
          !unread.length || this.state.viewing ? null :
          <div className="notification-badge">{unread.length}</div> 
        }
        <img className="notifications-icon" src={notificationsIcon}/>
        { 
        this.state.viewing ? 
        <NotificationsList 
        read={read} 
        unread={unread}
        closeList={this.closeNotifications}/> : 
        null 
        }
      </div>
    )
  }
}

export default Notifications;