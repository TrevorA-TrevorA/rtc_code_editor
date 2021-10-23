import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { LOGOUT } from '../reducers/auth_reducer'
import { GravatarUrl } from '../context/gravatar_url';
import Notifications from './notifications';
import AvatarChangeContainer from '../containers/avatar_change_container';

class Nav extends React.Component {
  static contextType = GravatarUrl;
  
  constructor(props) {
    super(props)
    this.logout = this.logout.bind(this);
    this.state = { changeAvatar: false };
  }

  closeAvatarForm = () => {
    this.setState({ changeAvatar: false })
  }

  openAvatarForm = () => {
    this.setState({ changeAvatar: true })
  }

  logout(e) {
    e.preventDefault();
    fetch("/api/session", { method: "DELETE" })
    .then(res => {
      if (res.ok) {
        this.props.dispatch({ type: LOGOUT })
        location.replace("/");
      } else {
        throw new Error(res.statusText)
      }
    })
    .catch(error => console.log(error.message));
  }
  
  render() {
    if (!this.props.user) {
      return <Redirect to="/"/>
    }

    const imURL = this.props.avatarUrl || this.context(this.props.user.email);
    return(
    <div className="nav-menu">
      <div className="avatar-and-name">
        <img onClick={this.openAvatarForm.bind(this)} 
        className="avatar" alt="user avatar" src={imURL}/>
        <h5>Welcome, {this.props.user.username}</h5>
      </div>
      <div className="right-nav">
        <Notifications user={this.props.user}/>
        <Link to="/" onClick={this.logout}>Logout</Link>
      </div>
        { 
          this.state.changeAvatar ?
          <AvatarChangeContainer closeForm={this.closeAvatarForm.bind(this)}/> : 
          null 
        }
    </div>
    )
  }
}

export default Nav;