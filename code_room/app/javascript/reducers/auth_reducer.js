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
      return { user, documents, editables, collaborations, selected };
    case LOGOUT: 
      return { 
        user: null, 
        documents: [], 
        editables: [], 
        selected: [], 
        collaborations: [] 
      }
    default:
      return user;
  }
};
