import React from 'react';
import { DashButtonRow } from './dash_button_row';
import DocListContainer from '../containers/doc_list_container'
import NavContainer from '../containers/nav_container';
import { Redirect } from 'react-router-dom';

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
      <DashButtonRow/>
      <DocListContainer/>
      </div>
    </div>
    )
  }
}

export default Dash;