export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const authReducer = (_, action) => {
  switch (action.type) {
    case LOGIN:
      const user = action.user;
      const documents = user.documents;
      const editables = user.accepted_collab_documents;
      const collaborations = user.collaborations;
      const selected = [];
      const avatarUrl = action.user.avatar_url;
      const notifications = user.notifications;
      return { 
        user, 
        documents, 
        editables, 
        collaborations, 
        selected, 
        avatarUrl,
        notifications,
        errorMessage: ""
      };
    case LOGOUT: 
      return { 
        user: null, 
        documents: [], 
        editables: [], 
        selected: [], 
        collaborations: [],
        notifications: [],
        errorMessage: ""
      }
    default:
      return user;
  }
};
