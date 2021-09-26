import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { LOGOUT } from '../reducers/auth_reducer'
import md5 from 'md5';

class Nav extends React.Component {
  constructor(props) {
    super(props)
    this.logout = this.logout.bind(this);
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

    const hash = md5(this.props.user.email);
    const imURL = `https://www.gravatar.com/avatar/${hash}?d=mp`
    return(
    <div className="nav-menu">
      <div className="avatar-and-name">
        <img className="avatar" src={imURL}></img>
        <h5>Welcome, {this.props.user.username}</h5>
      </div>
      <Link to="/" onClick={this.logout}>Logout</Link>
    </div>
    )
  }
}

export default Nav;