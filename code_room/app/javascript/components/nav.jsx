import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { LOGOUT } from '../reducers/auth_reducer'

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
      } else {
        throw new Error(res.statusText)
      }
    }).catch(error => console.log(error.message));
  }
  
  render() {
    return(
    <div className="nav-menu">
      <h5>Welcome, {this.props.user.username}</h5>
      <Link to="/" onClick={this.logout}>Logout</Link>
    </div>
    )
  }
}

export default Nav;