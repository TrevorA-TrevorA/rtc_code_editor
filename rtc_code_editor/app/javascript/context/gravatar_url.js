import React from 'react';
import md5 from 'md5';

const get_gravatar_url = useremail => {
  const hash = md5(useremail);
  return `https://www.gravatar.com/avatar/${hash}?d=mp`;
}


export const GravatarUrl = React.createContext(get_gravatar_url);