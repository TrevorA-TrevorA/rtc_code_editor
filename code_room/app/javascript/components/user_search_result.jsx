import React from 'react';
import md5 from 'md5';

 window.UserSearchResults = [];

class UserSearchResult extends React.Component {
  constructor(props) {
    super(props);
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
      this.collaborations.push(json);
      this.setState({ invited: true })
    })
    .catch(error => console.log(error));
  }

  rescindInvitation() {
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