import React from 'react';
import notificationsIcon from 'images/notifications-icon.png';
import connectToNotifications from '../channels/notifications_channel';
import NotificationsList from './notifications_list';
import NotificationsModal from './notifications_modal';
import { NotificationUtilities } from '../context/notification_utilities';
import { OPEN_CHANNEL, CLOSE_CHANNEL } from '../reducers/doc_connection_reducer';

class Notifications extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      notifications: [],
      viewing: false,
      modalOpen: false
    }

    this.totalNotifications = this.totalNotifications.bind(this);
    this.totalUnread = this.totalUnread.bind(this);
    this.viewNotifications = this.viewNotifications.bind(this);
    this.setDocConnection = this.setDocConnection.bind(this);
    this.closeNotifications = this.closeNotifications.bind(this);
    this.markAllAsRead = this.markAllAsRead.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
    this.subscription = connectToNotifications(this.props.user, this.receiveNotifications.bind(this));
    this.delist = this.delist.bind(this);
    this.utilities = {
      sendNotification: this.sendNotification.bind(this),
      clearAll: this.clearAll.bind(this),
      removeNotification: this.removeNotification,
      closeListIfEmpty: this.closeListIfEmpty.bind(this),
      closeNotifications: this.closeNotifications,
      delist: this.delist,
      openModal: this.openModal.bind(this),
      closeModal: this.closeModal.bind(this),
    }
    window.notificationsComponent = this;
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  totalNotifications() {
    return this.state.notifications.length;
  }

  totalUnread() {
    return this.state.notifications.filter(notif => !notif.read).length;
  }

  clearAll() {
    const url = `/api/users/${this.props.user.id}/notifications`;
    fetch(url, { method: 'DELETE' })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
        return;
      }
      
      this.setState({
        notifications: [],
        viewing: false
      })
  }).catch(error => console.log(error))
  }

  removeNotification(notification) {
    const url = `/api/notifications/${notification.id}`;
    const options = { method: 'DELETE' }
    if (notification.notification_type !== "edit_activity") {
      this.delist(notification);
    }

    fetch(url, options)
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
    }).catch(error => console.log(error));
  }

  delist(data) {
    const notifId = data.rescind ? data.rescind.id : data.id;
    const notifications = this.state.notifications;
    let notif = notifications.find(notif => notif.id === notifId);
    if (notif) {
      notifications.splice(notifications.indexOf(notif), 1)
      this.setState({ notifications: notifications })
    } 

    if (!notifications.length) this.closeNotifications();
  }

  receiveNotifications(data) {
    console.log(data)
    if (data.rescind) {
      this.delist(data);
      return;
    }

    if (data.new_notification) {
      const { notifications } = this.state;
      notifications.unshift(data.new_notification)
      this.setState({ notifications: notifications })
      return;
    }

    const { edit_activity, notifications } = data;

    if (edit_activity) {
      this.setDocConnection(data)
    }

    if (!notifications) return;

    notifications.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

    this.setState({
      notifications: notifications
    })
  }

  setDocConnection(data) {
    data.edit_activity.forEach(notif => {
    const docId = notif.details.document_id;
      switch(notif.details.action) {
        case "open channel":
          this.props.dispatch({ type: OPEN_CHANNEL, docId  });
          break;
        case "close channel":
          this.props.dispatch({ type: CLOSE_CHANNEL, docId  });
          break;
        default:
          break;
      }
    
      this.removeNotification(notif)
    })
      return;
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
    }).then(json => {
      json.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
      setTimeout(() => this.setState({ notifications: json }), 1500);
    })
    .catch(error => console.log(error));
  }

  viewNotifications() {
    if (!this.totalNotifications()) return;
    this.setState({ viewing: true })
    if (this.state.notifications.some(notif => !notif.read)) {
      this.markAllAsRead();
    }
  }

  closeListIfEmpty() {
    if (!this.state.notifications.length) {
      this.closeNotifications();
    }
  }

  openModal() {
    this.setState({ modalOpen: true })
  }

  closeModal() {
    this.setState({ modalOpen: false })
  }

  closeNotifications() {
    if (!this.state.viewing) return;

      this.setState({
        viewing: false
      })
  }

  sendNotification(n) {
    this.subscription.send(n)
  }

  render() {
    const unreadCount = this.totalUnread();
    const callback = this.state.viewing ? this.closeNotifications : this.viewNotifications
    return(
      <NotificationUtilities.Provider value={this.utilities}>
      <div id="notifications">
        <div onClick={callback} className="notifications-icon-container">
        { 
          !unreadCount || this.state.viewing ? null :
          <div className="notification-badge">{unreadCount}</div> 
        }
        <img className="notifications-icon" src={notificationsIcon}/>
        </div>
        { 
          this.state.viewing ? 
          <NotificationsList 
          notifications={this.state.notifications}
          /> :
          null 
        }
        {
          this.state.modalOpen && this.state.notifications.length ? 
          <NotificationsModal notifications={this.state.notifications}/> : 
          null
        }
      </div>
      </NotificationUtilities.Provider>
    )
  }
}

export default Notifications;