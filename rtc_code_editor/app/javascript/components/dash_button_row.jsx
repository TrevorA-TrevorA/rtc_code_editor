import React from 'react';
import { UploadButtonContainer, DeleteButtonContainer } from '../containers/dash_button_containers';
import { ManageEditorsButtonContainer } from '../containers/dash_button_containers';
import { AddNewDoc } from './dash_buttons';

export const DashButtonRow = props => {
  return (
    <div className="dash-button-row">
      <AddNewDoc/>
      <UploadButtonContainer/>
      <DeleteButtonContainer/>
      <ManageEditorsButtonContainer callback={props.callback}/>
    </div>
  )
}