import React from 'react';
import { ADD_COLLABORATION } from '../reducers/collab_reducer';
import { SendNotification } from '../context/send_notification';

class CollabRequest extends React.Component {
  constructor(props) {
    super(props)
    this.state = { answered: false }
    this.ref = React.createRef();
    this.removeNotification = this.removeNotification.bind(this);
    this.acceptEditAccess = this.acceptEditAccess.bind(this);
    window.collabRequest = this;
  }

  static contextType = SendNotification;

  componentDidUpdate() {
    if (this.state.answered) {
      const notif = this.ref.current;
      $(notif).find("*").css({ opacity: 0 });
      $(notif).animate({height: 0, padding: "0px 15px"}, 300);
      setTimeout(() => {
        $(notif).css({display: "none"})
        this.removeNotification()
        this.props.closeListIfEmpty();
      }, 300)

      const acceptance = {
        recipient_id: null,
        notification_type: "collaboration_acceptance",
        details: {
          document_id: this.props.notification.details.document_id,
          file_name: this.props.notification.details.file_name,
          editor_id: this.props.notification.recipient_id
        }
      }

      this.context(acceptance);
    }
  }

  removeNotification() {
    const url = `/api/notifications/${this.props.notification.id}`;
    const options = { method: 'DELETE' }
    this.props.delist(this.props.notification);

    fetch(url, options)
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
    }).catch(error => console.log(error));
  }


  acceptEditAccess() {
    const collab_id = this.props.notification.details.collaboration_id;
    const url = `/api/collaborations/${collab_id}`;
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

      this.setState({ answered: true });
    }).catch(error => console.log(error));
  }

  render() {
    const notification = this.props.notification;
    const colorClass = !this.props.read ? " unread" : "";

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
          <button onClick={this.acceptEditAccess}>Accept</button>
          <button>Decline</button>
        </div>
      </div>
    )
  }
}

export default CollabRequest;
