import consumer from "./consumer"

   const connectToDoc = (docId, editCallback, cursorPosCallback, connectCallback) => {
    return consumer.subscriptions.create({channel: "DocChannel", document_id: docId}, {
      connected() {
        console.log("doc channel connected...")
        connectCallback();
      },

      disconnected() {
        // Called when the subscription has been terminated by the server
      },

      received(data) {
        if (data.editors) {
          console.log(data)
          return;
        }
        
        data.changeData ? editCallback(data) : cursorPosCallback(data)
      }
    });
  }


  export default connectToDoc;
  window.consumer = consumer;