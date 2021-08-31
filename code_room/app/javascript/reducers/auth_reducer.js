export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const authReducer = (authState = { user: null }, action) => {
  switch (action.type) {
    case LOGIN:
      return { user: action.user };
    case LOGOUT:
      return { user: null };
    default:
      return authState;
  }
};
