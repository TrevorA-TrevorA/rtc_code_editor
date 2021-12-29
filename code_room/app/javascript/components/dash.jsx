import React from 'react';
import { DashButtonRow } from './dash_button_row';
import DocListContainer from '../containers/doc_list_container'
import NavContainer from '../containers/nav_container';
import { Redirect } from 'react-router-dom';
import CollabManagerContainer from '../containers/collab_manager_container';
let openNewDocForm;
let closeNewDocForm;

class Dash extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      managerOpen: false,
      newDoc: false
    }
    openNewDocForm = this.openDocFormRow.bind(this);
    closeNewDocForm = this.closeDocFormRow.bind(this);
    window.dash = this;
    this.dashRef = React.createRef();
  }

  toggleManager() {
    if (!this.props.selected.length) return;
    const current = this.state.managerOpen;
    this.setState({ managerOpen: !current })
  }

  openDocFormRow() {
    this.setState({ newDoc: true })
  }

  captureKeys(e) {
    if (e.key === "+" && !this.state.newDoc) {
      e.preventDefault();
      this.openDocFormRow();
    }
  }

  closeDocFormRow() {
    this.setState({ newDoc: false })
  }

  componentDidUpdate() {
    this.state.newDoc ?
    fileName.focus() :
    this.dashRef.current.focus()
  }

  componentDidMount() {
    this.dashRef.current.focus();
  }

  render() {
    if (!this.props.user) {
      return <Redirect to="/"/>
    }

    return (
    <div
    tabIndex={0}
    ref={this.dashRef}
    onKeyDown={this.captureKeys.bind(this)}
    className="dash"
    >
      <NavContainer/>
      <div className="gray-area">
      <DashButtonRow callback={this.toggleManager.bind(this)}/>
      <DocListContainer newDoc={this.state.newDoc}/>
      { this.state.managerOpen ? <CollabManagerContainer callback={this.toggleManager.bind(this)}/> : null }
      </div>
    </div>
    )
  }
}

export default Dash;
export { openNewDocForm };
export { closeNewDocForm };