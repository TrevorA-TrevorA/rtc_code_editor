import React, { useState } from 'react';
import { LOGOUT } from '../reducers/auth_reducer';
import ConfirmationBox from './confirmation_box';

const SettingsMenu = props => {
  const [ confirmationPending, setConfirmationPending ] = useState(false);
  
  const deleteUser = () => {
    const url = `api/users/${props.user.id}`;
    const options = { method: 'DELETE' }
    fetch(url, options)
    .then(res => {
      if (res.ok) {
        props.dispatch({ type: LOGOUT })
      } else {
        throw new Error(res.statusText);
      }
    }).catch(error => console.log(error));
  }

  const cancelDeletion = () => setConfirmationPending(false);
  const confirmDeletion = () => setConfirmationPending(true);
  
  return (
    <div id="settings-menu">
      <div onClick={confirmDeletion} className='settings-menu-item'>
        <p>DELETE ACCOUNT</p>
      </div>
      { 
      confirmationPending ?
        <ConfirmationBox 
          confirmCallback={deleteUser}
          cancelCallback={cancelDeletion}
          message="Are you sure you want to delete your account?"
        /> : 
        null 
      }
    </div>
  )
}

export default SettingsMenu;