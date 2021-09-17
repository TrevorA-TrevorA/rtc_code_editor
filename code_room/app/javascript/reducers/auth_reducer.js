export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const authReducer = (user = null, action) => {
  switch (action.type) {
    case LOGIN:
      return action.user;
    default:
      return user;
  }
};
