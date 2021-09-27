import React from 'react';
import { v4 as uuid } from 'uuid';
import md5 from 'md5';

class CollabManager extends React.Component {
  constructor(props) {
    super(props)
    this.searchUsers = this.searchUsers.bind(this)
    this.state = { 
      selectedDoc: this.props.selected[0],
      userSearchResults: []
    };
    window.CollabManager = this;
  }

  async searchUsers(e) {
    if (!e.target.value) {
      this.setState({userSearchResults: []})
      return;
    }
    try {
      let search = await fetch(`/api/users?q=${e.target.value}`)
      let results = await search.json();
      if (!search.ok) throw new Error(search.statusText);
      this.setState({ userSearchResults: results });
    } catch(err) {
      console.log(err);
    }
  }


  render() {
    console.log("re-rendering")
    return (
      <div id="collab">
        <button onClick={this.props.callback} id="closeCollab">X</button>
        <div className="editor-search">
          <input 
          onInput={this.searchUsers} 
          className="editor-search-bar" 
          type="text"/>
        <div className="user-search-results">
          {this.state.userSearchResults.map(user => {
            if (user.id === this.props.user.id) return;
             const hash = md5(user.email);
             const imURL = `https://www.gravatar.com/avatar/${hash}?d=mp`
            return (
              <div key={uuid()} className="user-search-result">
                <img className="avatar" src={imURL}/>
                <p>{user.username}</p>
              </div>
            )
          })}
        </div>
        </div>
        <div className="collab-details">
        <select className="doc-selector">
            {this.props.selected.map((doc, i) => {
              return (
                <option key={uuid()} defaultValue={!i} value={doc.id}>{doc.file_name}</option>
              )
            })}
          </select>
        </div>
      </div>
    )
  }  
}

export default CollabManager;