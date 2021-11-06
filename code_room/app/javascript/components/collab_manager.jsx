import React from 'react';
import { v4 as uuid } from 'uuid';
import UserSearchResult from './user_search_result';
import EditorList from './editor_list';

class CollabManager extends React.Component {
  constructor(props) {
    super(props)
    this.searchUsers = this.searchUsers.bind(this)
    this.state = { 
      selectedDoc: this.props.selected[0],
      userSearchResults: []
    };
    window.CollabManager = this;
    this.isAdmin = false;
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
    if (this.props.user.documents.some(doc => {
      return doc.id === this.state.selectedDoc.id;
    })) {
      this.isAdmin = true;
    }

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
            if (user.accepted_collab_documents.some(doc => {
              return doc.id === this.state.selectedDoc.id;
            })) return;
            return <UserSearchResult 
            key={uuid()} 
            self={this.props.user} 
            user={user} 
            doc={this.state.selectedDoc}/>
          })}
        </div>
        </div>
        <div className="collab-details">
          <select
          value={this.state.selectedDoc.id}
          className="doc-selector"
          onChange={(e) => {
           const newSelected = this.props.selected.find(doc => doc.id === e.target.value);
           this.setState({ selectedDoc: newSelected })
            }
          }>
            {this.props.selected.map((doc) => {
              return (
                <option
                key={uuid()}
                value={doc.id}>
                  {doc.file_name}
                </option>
              )
            })}
          </select>
          <EditorList isAdmin={this.isAdmin} document_id={this.state.selectedDoc.id}/>
        </div>
      </div>
    )
  }  
}

export default CollabManager;