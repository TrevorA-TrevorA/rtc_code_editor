import React from 'react';
import { UploadButtonContainer, DeleteButtonContainer, DownloadButtonContainer } from '../containers/dash_button_containers';
import { ManageEditorsButton } from './dash_buttons';

export const DashButtonRow = () => {
  return (
    <div className="dash-button-row">
      <UploadButtonContainer/>
      <DownloadButtonContainer/>
      <DeleteButtonContainer/>
      <ManageEditorsButton/>
    </div>
  )
}