import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { encode } from 'urlsafe-base64';
import CircleLoader from 'react-spinners/CircleLoader';

const PasswordReset = () => {
  const [ state, setState ] = useState({ 
    email: '', 
    processing: false, 
    errorText: '',
    emailSent: false
   })

  const requestPasswordReset = () => {
    const email = state.email;
    const encoded = encode(window.btoa(email))
    const url = `/users/reset-password/${encoded}`
    fetch(url).then(res => res.json())
    .then(json => {
      switch(json.status) {
        case 400:
          setState({email: '', processing: false, errorText: json.message});
          break;
        case 200:
          setState({...state, processing: false, emailSent: true})
          break;
        default:
          return;
      }
    })
    .catch(error => console.log(error))
  }

  useEffect(() => {
    if (state.processing) {
      requestPasswordReset();
    }
  })

  if (state.emailSent) {
    return (
      <div className='password-reset'>
        <h3>A link to reset your password has been sent to {state.email}</h3>
      </div>
    )
  }

  if (state.processing) {
    return <div className='password-reset'>
      <CircleLoader loading color={'#FFFFFF'}/>
      </div>
  }
  
  return (
    <div className='password-reset'>
      <div className='form-container'>
        { state.errorText ? <p className='unregistered-email-error'>{state.errorText}</p> : null }
        <input id='passwordResetEmail' type='email'/>
        <input 
        onClick={
          () => setState({ email: passwordResetEmail.value, processing: true })
          } type='submit' value="send password reset email"/>
      </div>
      <Link className='nav-link' to="/log-in">sign in</Link>
    </div>
  )
}

export default PasswordReset;