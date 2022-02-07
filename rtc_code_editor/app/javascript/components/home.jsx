import React from 'react';
// import LoginContainer from '../containers/login_container';
import { Redirect } from 'react-router-dom'
import IntroDisplay from './intro_display';

class Home extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return this.props.user ? <Redirect to="/dash"/> : <IntroDisplay/>;
  }
}

export default Home;