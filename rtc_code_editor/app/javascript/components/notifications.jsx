import React from 'react';
import notificationsIcon from 'images/notifications-icon-white.png';
import connectToNotifications from '../channels/notifications_channel';
import NotificationsList from './notifications_list';
import NotificationsModal from './notifications_modal';
import { NotificationUtilities } from '../context/notification_utilities';
import { REMOVE_COLLABORATION  } from '../reducers/collab_reducer';
import { CLEAR_NOTIFICATIONS, SET_NOTIFICATIONS  } from '../reducers/notification_reducer';

class Notifications extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      viewing: false,
      modalOpen: false
    }

    this.totalNotifications = this.totalNotifications.bind(this);
    this.totalUnread = this.totalUnread.bind(this);
    this.viewNotifications = this.viewNotifications.bind(this);
    this.closeNotifications = this.closeNotifications.bind(this);
    this.markAllAsRead = this.markAllAsRead.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
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
  }

  componentDidMount() {
    this.subscription = connectToNotifications(this.props.user, this.receiveNotifications.bind(this));
  }

  componentDidUpdate() {
    if (!this.props.notifications.length && this.state.viewing) {
      this.setState({viewing: false});
    }
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  totalNotifications() {
    return this.props.notifications.length;
  }

  totalUnread() {
    return this.props.notifications.filter(notif => !notif.read).length;
  }

  clearAll() {
    const url = `/api/users/${this.props.user.id}/notifications`;
    fetch(url, { method: 'DELETE' })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
        return;
      }
      
      this.props.dispatch({type: CLEAR_NOTIFICATIONS})
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
    const notifications = this.props.notifications;
    let notif = notifications.find(notif => notif.id === notifId);
    if (notif) {
      notifications.splice(notifications.indexOf(notif), 1)
      this.props.dispatch({ type: SET_NOTIFICATIONS, notifications });
    } 

    if (!notifications.length) this.closeNotifications();
  }

  receiveNotifications(data) {
    
    if (data.rescind) {
      this.delist(data);
      return;
    }

    if (data.revocation) {
      const docId  = data.revocation.details.document_id
      const collaborationId = data.revocation.details.collab_id
      this.props.dispatch({ type: REMOVE_COLLABORATION, docId, collaborationId })
      return;
    }

    if (data.new_notification) {
      const type = data.new_notification.notification_type;
      if (type === "collaboration_decline") return;
      if (type === "deletion_notice") {
        const { document_id, collaboration_id } = data.new_notification.details;

        this.props.dispatch({ 
          type: REMOVE_COLLABORATION, 
          docId: document_id, 
          collaborationId: collaboration_id 
        })
      }

      const  notifications  = this.props.notifications
      notifications.unshift(data.new_notification)
      this.props.dispatch({ type: SET_NOTIFICATIONS, notifications: [...notifications] })
      return;
    }
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
      setTimeout(() => this.props.dispatch({ type: SET_NOTIFICATIONS, notifications: json }), 1500);
    })
    .catch(error => console.log(error));
  }

  viewNotifications() {
    if (!this.totalNotifications()) return;
    this.setState({ viewing: true })
    if (this.props.notifications.some(notif => !notif.read)) {
      this.markAllAsRead();
    }
  }

  closeListIfEmpty() {
    if (!this.props.notifications.length) {
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
          notifications={this.props.notifications}
          /> :
          null 
        }
        {
          this.state.modalOpen && this.props.notifications.length ? 
          <NotificationsModal notifications={this.props.notifications}/> : 
          null
        }
      </div>
      </NotificationUtilities.Provider>
    )
  }
}

export default Notifications;