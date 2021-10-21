import React, { useState } from 'react';
import * as urlRegex from 'url-regex';

const AvatarChange = props => {
  const [error, setError] = useState("");

  const updateAvatar = e => {
    const avatarUrl = avatarUrlForm.value;
    if (!urlRegex().test(avatarUrl)) {
      setError("Please enter a valid URL");
      return;
    };

    const userUrl = `api/users/${props.user.id}`
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ avatar_url: avatarUrl})
    }

    fetch(userUrl, options).
    then(res => {
      if (!res.ok) {
        throw new Error(res.statusText);
      } else {
        return res.json();
      }
    }).then(json => {
      console.log(json);
      props.closeForm();
    })
    .catch(error => console.log(error))
  }

  return (
    <div className="avatar-change">
      <h4>Enter the URL for your prefered avatar:</h4>
      <input id="avatarUrlForm" type="text"/>
      <div className="avatar-change-buttons">
        <button onClick={props.closeForm}>Cancel</button>
        <button onClick={updateAvatar}>Update</button>
      </div>
    </div>
  )
}

export default AvatarChange;