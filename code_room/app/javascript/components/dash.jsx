import React from 'react';
import NavContainer from '../containers/nav_container'
import { Redirect } from 'react-router-dom'
import AceEditor from 'react-ace';
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
      <AceEditor
      height="60%"
      width="45%"
      mode="javascript"
      theme="monokai"
      />
    </div>
    )
  }
}

export default Dash;