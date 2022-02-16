export const SET_NOTIFICATIONS = 'SET NOTIFICATIONS';
export const CLEAR_NOTIFICATIONS = 'CLEAR NOTIFICATIONS';

export const notificationReducer = (_, action) => {
  switch(action.type) {
    case SET_NOTIFICATIONS:
      const { notifications } = action;
      notifications.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
      return notifications;
    case CLEAR_NOTIFICATIONS:
      return [];
  }
}