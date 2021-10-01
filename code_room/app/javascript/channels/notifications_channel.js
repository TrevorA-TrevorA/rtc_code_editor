import consumer from "./consumer"

const connectNotifications = (user) => {
  consumer.subscriptions.create({ channel: "NotificationsChannel", id: user.id }, {
    connected() {
      // Called when the subscription is ready for use on the server
    },

    disconnected() {
      // Called when the subscription has been terminated by the server
    },

    received(data) {
      // Called when there's incoming data on the websocket for this channel
    }
  });
}

export default connectNotifications;
