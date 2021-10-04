import React from 'react';
window.notRefs = [];
class Notification extends React.Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef();
    window.notRefs.push(this.ref);
  }

  render() {
    const notification = this.props.notification;
    const colorClass = !this.props.read ? " unread" : "";
    if (notification.notification_type !== "collaboration_request") return;
    const notificationMessage = `${notification.details.document_admin} has invited you to edit ${notification.details.file_name}`;
    return (
      <div ref={this.ref} className={"notification" + colorClass}>
        <div className="notification-message-container">
        <h4 className="notification-message"
          title={notificationMessage}
        >
          {notification.details.document_admin} has invited you to edit
        </h4>
        <h4 className="notification-message-file-name">{notification.details.file_name}</h4>
        </div>
        <div className="response-button-row">
          <button>Accept</button>
          <button>Decline</button>
        </div>
      </div>
    )
  }
}

export default Notification;
