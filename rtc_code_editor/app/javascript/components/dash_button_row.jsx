import React from 'react';
import { UploadButtonContainer, DeleteButtonContainer } from '../containers/dash_button_containers';
import { ManageEditorsButton } from './dash_buttons';
import { AddNewDoc } from './dash_buttons';

export const DashButtonRow = props => {
  return (
    <div className="dash-button-row">
      <AddNewDoc/>
      <UploadButtonContainer/>
      <DeleteButtonContainer/>
      <ManageEditorsButton callback={props.callback}/>
    </div>
  )
}