import consumer from "./consumer"

   const connectToDoc = (callback) => {
    return consumer.subscriptions.create("DocChannel", {
      connected() {
        console.log("doc channel connected...")
      },

      disconnected() {
        // Called when the subscription has been terminated by the server
      },

      received(data) {
        console.log(data)
        callback(data)
      }
    });
  }


  export default connectToDoc;
  window.consumer = consumer;