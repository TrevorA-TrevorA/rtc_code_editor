import consumer from "./consumer"

   const connectToDoc = (editCallback, cursorPosCallback, connectCallback) => {
    return consumer.subscriptions.create("DocChannel", {
      connected() {
        console.log("doc channel connected...")
        connectCallback();
      },

      disconnected() {
        // Called when the subscription has been terminated by the server
      },

      received(data) {
        data.changeData ? editCallback(data) : cursorPosCallback(data)
      }
    });
  }


  export default connectToDoc;
  window.consumer = consumer;