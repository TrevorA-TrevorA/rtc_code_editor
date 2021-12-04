import consumer from "./consumer"

   const connectToDoc = (docId, editing, callbacks, userId) => {
    return consumer.subscriptions.create({
      channel: "DocChannel", 
      document_id: docId,
      editing
    }, {
      connected() {
        console.log("doc channel connected...")
        if (editing) callbacks.connect();
      },

      disconnected() {
        console.log("doc channel disconnected")
        // Called when the subscription has been terminated by the server
      },

      received(data) {
        if (data.join || data.offer || data.iceCandidate || data.answer) {
          if (data.senderId === userId || !editing) return;
          callbacks.initConnection(data)
          return
        }
        
        if (data.saved_state) {
          callbacks.save(data)
          return;
        }
        
        if (data.sync) {
          callbacks.sendState(data);
          return;
        }

        if(data.currentState) {
          callbacks.syncState(data);
          return;
        }
        
        if (data.document) {
          callbacks.initialize(data)
          return;
        }
        
        if (data.editors) {
          callbacks.editorList(data);
          return;
        }
        
        data.backup ? callbacks.edit(data) : callbacks.cursor(data)
      },

      resubscribe() {
        this.perform("subscribed");
      }
    });
  }


  export default connectToDoc;