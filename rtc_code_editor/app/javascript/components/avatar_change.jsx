import React, { useState } from 'react';
import { UPDATE_AVATAR_URL, DELETE_AVATAR_URL } from '../reducers/root_reducer';
import * as urlRegex from 'url-regex-safe';

const AvatarChange = props => {
  const [error, setError] = useState("");

  const updateAvatar = () => {
    const avatarUrl = avatarUrlForm.value || null;

    if (!props.avatarUrl && !avatarUrl) return;

    if (avatarUrl && !urlRegex().test(avatarUrl)) {
      setError("Please enter a valid URL");
      return;
    };

    const userUrl = `/api/users/${props.user.id}`
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
      if (!json["avatar_url"]) {
        props.dispatch({ type: DELETE_AVATAR_URL })
      } else {
        props.dispatch({ type: UPDATE_AVATAR_URL, url: json["avatar_url"] })
      }

      props.closeForm();
    })
    .catch(error => console.log(error))
  }

  return (
    <div className="avatar-change">
      { error ? <h4>{error}</h4> : null }
      <h4>Enter the URL for your prefered avatar:</h4>
      <input id="avatarUrlForm" type="text" defaultValue={props.avatarUrl}/>
      <div className="avatar-change-buttons">
        <button onClick={props.closeForm}>Cancel</button>
        <button onClick={updateAvatar}>Update</button>
      </div>
    </div>
  )
}

export default AvatarChange;