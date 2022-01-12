import React, { useState } from 'react';
import { useEffect } from 'react';
import CircleLoader from 'react-spinners/CircleLoader';

const newPasswordForm = props => {
  const [ state, setState ] = useState({ 
    password: '', 
    passwordConf: '',
    errorText: '',
    processing: false,
    updateSuccessful: false
  })
  
  const updatePassword = () => {
    if (!newPasswordValid) return;
    const url = '/users/update_password';
    const headers = {'Content-Type': 'application/json'};
    const body = JSON.stringify({
      user: {
        password_reset_token: props.token,
        password: state.password,
        password_confirmation: state.passwordConf
      }
    })
    const method = 'PATCH';
    fetch(url, { method, body, headers })
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText);
      } else {
        console.log(res.status);
        setState({...state, processing: false, updateSuccessful: true })
      }
    }).catch(error => setState({...state, processing: false, errorText: error.message}))
  }

  const newPasswordValid = () => {
    if (enterNewPW.value !== confirmNewPW) {
      setState({...state, processing: false, errorText: 'passwords do not match'})
      return false;
    } else if (enterNewPW.value.length < 8) {
      setState({...state, processing: false, errorText: 'password must be at least 8 characters'})
      return false;
    } else {
      return true;
    }
  }

  useEffect(() => {
    if (state.processing) {
      updatePassword();
    }
  })
  
  if (state.updateSuccessful) {
    return (
      <div className='new-password'>
        <h2 className='pw-update-confirmation'>Your password has been updated</h2>
        <button onClick={() => {
          window.location.replace('/log-in')
        }} className='sign-in-button'>sign in</button>
      </div>
    )
  }

  if (state.processing) {
    return (<div className='new-password'>
      <CircleLoader loading color={'#FFFFFF'}/>
    </div>)
  }
  
  return (
    <div className='new-password'>
      <form id='new-password-form'>
        <label>Enter new password</label>
        <input id='enterNewPW' type='password'/>
        <label>Confirm new password</label>
        <input id='confirmNewPW' type='password'/>
        <div className='submit-row'>
          <input onClick={(e) => {
              e.preventDefault();
              setState({
              password: enterNewPW.value,
              passwordConf: confirmNewPW.value,
              processing: true
            })
          }
          } type='submit' value='reset password'/>
          { 
          state.errorText ? 
          <p className='auth-error-text'>{state.errorText}</p> :
          null
        }
        </div>
      </form>
    </div>
  )
}

export default newPasswordForm;