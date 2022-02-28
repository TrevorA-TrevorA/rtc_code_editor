import consumer from "./consumer"

const connectToNotifications = (user, receiveNotifications) => {
  return consumer.subscriptions.create({ channel: "NotificationsChannel", id: user.id }, {

    received(data) {
      if (!receiveNotifications) return;
      receiveNotifications(data);
    }
  });
}

export default connectToNotifications;
