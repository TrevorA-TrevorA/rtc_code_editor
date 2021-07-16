import consumer from "./consumer"

if (/rooms/.test(location.href)) {

  consumer.subscriptions.create("RoomChannel", {
    connected() {
      console.log("connected...")
      // Called when the subscription is ready for use on the server
    },

    disconnected() {
      // Called when the subscription has been terminated by the server
    },

    received(data) {
      console.log(data)
      // Called when there's incoming data on the websocket for this channel
    }
  });
}
