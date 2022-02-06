import React, { useState, useEffect } from 'react';
import gearIcon from 'images/settings_gear_white.png';
import SettingsMenuContainer from '../containers/settings_menu_container';

const Settings = () => {
  const [ settingsOpen, setSettingsDisplay ] = useState(false);

  const openSettings = () => setSettingsDisplay(true);

  useEffect(() => {
    if (settingsOpen) {
      const settingsContent = Array.from($("#settings-menu").find('*'));

      $("body").on("click", (e) => {
        if ($("#settings-menu")[0] === e.target) return;
        if (settingsContent.includes(e.target)) return;
        setSettingsDisplay(false);
      })
    } else {
      $("body").off("click");
    }
  })
    
  return (
    <div onClick={openSettings}>
      <img className='settings-icon' src={gearIcon} alt="settings icon"/>
      { settingsOpen ? <SettingsMenuContainer/> : null }
    </div>
  )
}

export default Settings;