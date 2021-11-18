export const OPEN_CHANNEL = "OPEN_CHANNEL";
export const CLOSE_CHANNEL = "CLOSE_CHANNEL";

export const docConnectionReducer = (state, action) => {
  const newState = {};
  Object.assign(newState, state);
  const { connectedDocs } = state;
  
  switch(action.type) {
    case OPEN_CHANNEL:
      newState.connectedDocs = Array.from(new Set([...connectedDocs, action.docId]));
      return newState;
    case CLOSE_CHANNEL:
      newState.connectedDocs = connectedDocs.filter(docId => docId !== action.docId);
      return newState;
    default:
      return state;
  }
}