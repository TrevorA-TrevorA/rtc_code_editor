import React from 'react';
import { UploadButtonContainer, DeleteButtonContainer } from '../containers/dash_button_containers';
import { DownloadButton, ManageEditorsButton } from './dash_buttons';

export const DashButtonRow = () => {
  return (
    <div className="dash-button-row">
      <UploadButtonContainer/>
      <DownloadButton/>
      <DeleteButtonContainer/>
      <ManageEditorsButton/>
    </div>
  )
}