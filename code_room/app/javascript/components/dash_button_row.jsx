import React from 'react';
import { UploadButtonContainer, DeleteButtonContainer, DownloadButtonContainer } from '../containers/dash_button_containers';
import { ManageEditorsButton } from './dash_buttons';

export const DashButtonRow = props => {
  return (
    <div className="dash-button-row">
      <UploadButtonContainer/>
      <DownloadButtonContainer/>
      <DeleteButtonContainer/>
      <ManageEditorsButton callback={props.callback}/>
    </div>
  )
}