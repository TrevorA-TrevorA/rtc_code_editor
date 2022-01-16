import consumer from "./consumer"

const connectToEditors = (docId, receiveEditors, isAdmin) => {
  return consumer.subscriptions.create({ 
    channel: "EditorsChannel", 
    document_id: docId, 
    admin: isAdmin
  }, {
    connected() {
      // Called when the subscription is ready for use on the server
    },

    disconnected() {
      // Called when the subscription has been terminated by the server
    },

    received(data) {
      receiveEditors(data);
    }
  });
}

export default connectToEditors;
