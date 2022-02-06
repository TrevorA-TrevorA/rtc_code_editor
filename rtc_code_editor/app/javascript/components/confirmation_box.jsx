import React from 'react';

const ConfirmationBox = props => {
  return (<div className='confirmation-box'>
    <p>{props.message}</p>
    <div className='confirmation-buttons'>
      <button onClick={props.confirmCallback} id='confirm-action'>Confirm</button>
      <button onClick={props.cancelCallback} id='cancel-action'>Cancel</button>
    </div>
  </div>)
}

export default ConfirmationBox;