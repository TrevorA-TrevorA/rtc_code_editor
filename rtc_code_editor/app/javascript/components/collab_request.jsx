import React from 'react';
import { ADD_COLLABORATION } from '../reducers/collab_reducer';
import { NotificationUtilities } from '../context/notification_utilities';

class CollabRequest extends React.Component {
  constructor(props) {
    super(props)
    this.state = { answer: "pending" }
    this.ref = React.createRef();
    this.acceptEditAccess = this.acceptEditAccess.bind(this);
    this.declineEditAccess = this.declineEditAccess.bind(this);
    this.collabId;
  }

  static contextType = NotificationUtilities;

  componentDidUpdate() {
    const { answer } = this.state;
    if (answer === "pending") return;

    const shouldClose = $(".notification").length === 1;
    const notif = this.ref.current;
    $(notif).find("*").css({ opacity: 0 });
    $(notif).animate({height: 0, padding: "0px 15px"}, 300);
    setTimeout(() => {
      $(notif).css({display: "none"})
      this.context.removeNotification(this.props.notification)
      if (shouldClose) this.context.closeListIfEmpty();
    }, 300)

    if (answer === "accept") {
      const acceptance = {
        recipient_id: this.props.notification.details.admin_id,
        notification_type: "collaboration_acceptance",
        details: {
          document_id: this.props.notification.details.document_id,
          file_name: this.props.notification.details.file_name,
          editor_id: this.props.notification.recipient_id,
          collab_id: this.collabId
        }
      }

      this.context.sendNotification(acceptance);
      return;
    }

    if (answer === "decline") {
      const decline = {
        recipient_id: this.props.notification.details.admin_id,
        notification_type: "collaboration_decline",
        details: {
          document_id: this.props.notification.details.document_id,
          file_name: this.props.notification.details.file_name,
          editor_id: this.props.notification.recipient_id,
          collab_id: this.collabId
        }
      }

      this.context.sendNotification(decline);
    }
  }

  declineEditAccess() {
    const collab_id = this.props.notification.details.collaboration_id;
    const url = `/api/collaborations/${collab_id}`;
    const options = {
      method: 'DELETE',
    }
    fetch(url, options)
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText);
      } else {
        this.setState({ answer: "decline" });
      }
    })
    .catch(error => console.log(error))
  }


  acceptEditAccess() {
    this.collabId = this.props.notification.details.collaboration_id;
    const url = `/api/collaborations/${this.collabId}`;
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    fetch(url, options)
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText);
      } else {
        return res.json();
      }
    }).then(json => {
      this.props.dispatch({ 
        type: ADD_COLLABORATION, 
        doc: json.document,
        collaboration: json.collaboration
      })

      this.setState({ answer: "accept" });
    }).catch(error => console.log(error));
  }

  render() {
    const notification = this.props.notification;
    const colorClass = !this.props.notification.read ? " unread" : "";

    const notificationMessage = `${notification.details.document_admin} has invited you to edit ${notification.details.file_name}`;
    return (
      <div ref={this.ref} className={"notification collab-request" + colorClass}>
        <div className="notification-message-container">
        <h4 className="notification-message"
          title={notificationMessage}
        >
          {notification.details.document_admin} has invited you to edit
        </h4>
        <h4 className="notification-message-file-name">{notification.details.file_name}</h4>
        </div>
        <div className="response-button-row">
          <button onClick={this.acceptEditAccess}>Accept</button>
          <button onClick={this.declineEditAccess}>Decline</button>
        </div>
      </div>
    )
  }
}

export default CollabRequest;
