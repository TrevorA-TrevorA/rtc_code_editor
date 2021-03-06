import React from 'react';
import { Link } from 'react-router-dom';
import worfDemo from 'videos/worf_view.mp4';
import dataDemo from 'videos/data_view.mp4';

const IntroDisplay = () => {

  const syncPlay = () => $(".demo-vid").each((_, v) => v.currentTime = 0);

  return (<div className='intro-view'>
    <div className='video-block'>
      <video className="demo-vid" onPlay={syncPlay} src={worfDemo} autoPlay loop muted/>
      <div className='auth-link'>
        <p>Sign In</p>
        <Link to="/log-in"/>
      </div>
    </div>
    <div className='video-block'>
      <video className="demo-vid" onPlay={syncPlay} src={dataDemo} autoPlay loop muted/>
      <div className='auth-link'>
        <p>Create Account</p>
        <Link to="/sign-up"/>
      </div>
    </div>
  </div>)
}

export default IntroDisplay;