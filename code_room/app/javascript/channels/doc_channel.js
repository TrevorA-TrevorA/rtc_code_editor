import consumer from "./consumer"

   const connectToDoc = (docId, callbacks) => {
    return consumer.subscriptions.create({channel: "DocChannel", document_id: docId}, {
      connected() {
        console.log("doc channel connected...")
        callbacks.connect();
      },

      disconnected() {
        // Called when the subscription has been terminated by the server
      },

      received(data) {
        if (data.editors) {
          callbacks.editorList(data);
          return;
        }
        
        data.changeData ? callbacks.edit(data) : callbacks.cursor(data)
      }
    });
  }


  export default connectToDoc;
  window.consumer = consumer;