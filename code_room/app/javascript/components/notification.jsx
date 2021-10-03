import { timers } from 'jquery';
import React from 'react';

class Notification extends React.Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef();
  }

  componentDidUpdate(prev) {
    if (!prev.read) {
      $(this.ref).css("background-color", "rgba(57, 77, 109, 0.3)")
    }
  }
  
  render() {
    const notification = this.props.notification;
    if (notification.notification_type !== "collaboration_request") return;

    return (
      <div ref={this.ref} className="notification">
        <p className="notification-message">
          {notification.details.document_admin} has invited you to edit {notification.details.file_name}
        </p>
        <div className="response-button-row">
          <button>Accept</button>
          <button>Decline</button>
        </div>
      </div>
    )
  }
}

export default Notification;
