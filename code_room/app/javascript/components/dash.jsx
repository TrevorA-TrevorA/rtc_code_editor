import React from 'react';
import { DashButtons } from './dash_buttons';
import NavContainer from '../containers/nav_container';
import { Redirect } from 'react-router-dom';
import "ace-builds";
import "ace-builds/webpack-resolver";

class Dash extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    if (!this.props.user) {
      return <Redirect to="/"/>
    }

    return (
    <div className="dash">
      <NavContainer/>
      <div className="gray-area">
      <DashButtons/>
      </div>
    </div>
    )
  }
}

export default Dash;