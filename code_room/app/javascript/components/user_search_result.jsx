import React from 'react';
import md5 from 'md5';
import connectToNotifications from '../channels/notifications_channel';

 window.UserSearchResults = [];

class UserSearchResult extends React.Component {
  constructor(props) {
    super(props);
    this.notificationSub = connectToNotifications(this.props.user);
    this.state = { 
      invited: (this.props.user.pending_collab_documents.some(doc => {
        return doc.id === this.props.doc.id;
      }))
    }

    this.collaborations = this.props.user.collaborations
    this.inviteUser = this.inviteUser.bind(this);
    this.rescindInvitation = this.rescindInvitation.bind(this);
    UserSearchResults.push(this);
  }

  componentWillUnmount() {
    this.notificationSub.unsubscribe();
  }

  inviteUser() {
    const url = `/api/users/${this.props.user.id}/collaborations`;
    const params = { 
      collaboration: {
        document_id: this.props.doc.id
      }
    }

    const options = {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json'
      }
    }

    fetch(url, options)
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then(json => {
      const collab_id = json.id;
      this.collaborations.push(json);
      this.setState({ invited: true })
      const notification = { 
        recipient_id: this.props.user.id,
        read: false,
        notification_type: "collaboration_request",
        details: {
          collaboration_id: collab_id,
          document_id: this.props.doc.id,
          document_admin: this.props.self.username,
          file_name: this.props.doc.file_name
        }
      }

      this.notificationSub.send(notification)
    })
    .catch(error => console.log(error));
  }

  rescindInvitation() {
    this.notificationSub.send({
      notification_type: "rescind",
      details: {
        document_id: this.props.doc.id, 
      },
      recipient_id: this.props.user.id
    })
    
    const collabId = this.collaborations.find(col => {
      return col.document_id === this.props.doc.id;
    }).id
    
    const url = `api/collaborations/${collabId}`;
    const options = {
      method: 'DELETE',
    }

    fetch(url, options)
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText);
      } else {
        return res.json();
      }
    })
    .then(json => {
      const collab_id = json.collaboration_id;
      let index;
      this.collaborations.forEach((collab, i) => {
        if (collab.id === collab_id) {
          index = i;
        }
      })

      this.collaborations.splice(index, 1);
      this.setState({ invited: false });
    })
    .catch(error => console.log(error));
  }

  render() {
    if (!this.props.user) {
      this.notificationSub.unsubscribe();
      return <Redirect to="/"/>
    }

    const hash = md5(this.props.user.email);
    const imURL = `https://www.gravatar.com/avatar/${hash}?d=mp`
    const buttonText = this.state.invited ? "Rescind" : "Invite";
    const callback = this.state.invited ? this.rescindInvitation : this.inviteUser;

    return (
      <div className="user-search-result">
        <button onClick={callback}>{buttonText}</button>
        <img className="avatar" src={imURL}/>
        <p>{this.props.user.username}</p>
      </div>
    )
  }
}

export default UserSearchResult;