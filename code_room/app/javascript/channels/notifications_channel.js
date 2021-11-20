import consumer from "./consumer"

const connectToNotifications = (user, receiveNotifications) => {
  return consumer.subscriptions.create({ channel: "NotificationsChannel", id: user.id }, {
    connected() {
      console.log("notifications channel connected")
    },

    disconnected() {
      // Called when the subscription has been terminated by the server
    },

    received(data) {
      if (!receiveNotifications) return;
      receiveNotifications(data);
      // Called when there's incoming data on the websocket for this channel
    }
  });
}

export default connectToNotifications;
