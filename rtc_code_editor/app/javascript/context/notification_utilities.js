import React from 'react';
const utilities = {
  sendNotification: () => {},
  clearAll: () => {},
  removeNotification: () => {},
  closeListIfEmpty: () => {},
  delist: () => {},
  closeNotifications: () => {},
  openModal: () => {},
  closeModal: () => {}
}

export const NotificationUtilities = React.createContext(utilities);
