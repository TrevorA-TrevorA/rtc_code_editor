import React from 'react';

const ErrorMessage = props => {
  return (
    <div className='error-message'>
      <p>{props.message}</p>
    </div>
  )
}

export default ErrorMessage;