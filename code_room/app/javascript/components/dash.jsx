import React from 'react';
import NavContainer from '../containers/nav_container'
import { Redirect } from 'react-router-dom'

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
    </div>
    )
  }
}

export default Dash;