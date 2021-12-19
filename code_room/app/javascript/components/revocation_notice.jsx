import React from 'react';
import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

const RevocationNotice = props => {
  const [noticeRendered, updateRenderStatus] = useState(false);
  
  useEffect(() => {
    if (noticeRendered) return;
    setTimeout(() => {
      updateRenderStatus(true)
    }, 3000)
  })

  return noticeRendered ?
  <Redirect to='/dash'/> : 
  (
  <div className='revocation-notice'>
    <p>{`Your Access to ${props.fileName} has been revoked.`}</p>
  </div>)
}

export default RevocationNotice;