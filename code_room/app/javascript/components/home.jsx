import React from 'react';
import LoginContainer from '../containers/login_container';
import { Redirect } from 'react-router-dom'

class Home extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    console.log(this.props.user)
    return this.props.user ? <Redirect to="/dash"/> : <LoginContainer/>;
  }
}

export default Home;