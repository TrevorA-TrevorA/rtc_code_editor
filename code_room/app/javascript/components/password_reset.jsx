import React from 'react';
import { Link } from 'react-router-dom';
import { encode } from 'url-safe-base64';

const PasswordReset = () => {
  const requestPasswordReset = () => {
    const email = passwordResetEmail.value;
    const encoded = encode(window.btoa(email))
    const url = `/users/reset-password/${encoded}`
    fetch(url).then(res => {
      if (!res.ok) {
        throw new Error(res.statusText);
      } else {
        return res.json()
      }
    }).then(json => console.log(json))
    .catch(error => console.log(error))
  }
  
  return (
    <div className='password-reset'>
      <input id='passwordResetEmail' type='email'/>
      <input onClick={requestPasswordReset} type='submit' value="send password reset email"/>
      <Link className='nav-link' to="/log-in">sign in</Link>
    </div>
  )
}

export default PasswordReset;