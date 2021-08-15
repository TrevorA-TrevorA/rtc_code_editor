import React from 'react';
import LoginContainer from '../containers/login_container';
import { Redirect } from 'react-router-dom'

class Home extends React.Component {
  render() {
    return window.currentUser ? <Redirect to="/dash"/> : <LoginContainer/>;
  }
}

export default Home;