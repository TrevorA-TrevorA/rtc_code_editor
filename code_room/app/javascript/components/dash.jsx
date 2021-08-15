import React from 'react';
import NavContainer from '../containers/nav_container'
import { Redirect } from 'react-router-dom'

class Dash extends React.Component {
  render() {
    if (!this.props.currentUser) {
      return <Redirect to="/"/>
    }

    return (
    <div>
      <h1>Welcome {currentUser.username}</h1>
      <NavContainer/>
    </div>
    )
  }
}

export default Dash;