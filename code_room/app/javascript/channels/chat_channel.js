import consumer from "./consumer"

   const connectToChat = (
      getChat, 
      getHeaderMessage,
      docId,
     ) => {
       
    return consumer.subscriptions.create({channel: "ChatChannel", document_id: docId}, {
      chatLog: [],

      connected() {
        console.log("chat channel connected...")
      },

      received(data) {
        if (data.headerMessage) {
          getHeaderMessage(data);
          return;
        }

        this.chatLog.push(data);
        getChat(this.chatLog);
      }
    });
  }


  export default connectToChat;