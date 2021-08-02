import React from 'react';
import Login from './login'

class Home extends React.Component {
  render() {
    return window.currentUser ? <h1>Logged in!</h1> : <Login/>;
  }
}

export default Home;