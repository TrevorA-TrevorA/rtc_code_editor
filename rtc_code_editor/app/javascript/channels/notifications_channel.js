import consumer from "./consumer"

const connectToNotifications = (user, receiveNotifications) => {
  return consumer.subscriptions.create({ channel: "NotificationsChannel", id: user.id }, {
    connected() {
      console.log("notifications channel connected")
    },

    received(data) {
      if (!receiveNotifications) return;
      receiveNotifications(data);
    }
  });
}

export default connectToNotifications;
