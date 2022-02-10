import consumer from "./consumer"

   const connectToChat = (
      getChat, 
      getHeaderMessage,
      sendChatLog,
      docId,
      userId
     ) => {
       
    return consumer.subscriptions.create({channel: "ChatChannel", document_id: docId}, {
      chatLog: [],

      connected() {
        console.log("chat channel connected...")
      },

      received(data) {
        if (data.arrival) {
          getHeaderMessage(data);
          sendChatLog(data, this.chatLog);
        }
        
        if (data.headerMessage) {
          getHeaderMessage(data);
          return;
        }

        if (data.chatLog) {
          if (data.recipient === userId) {
            this.chatLog = data.chatLog;
            getChat(data.chatLog);
          }
          
          return;
        }

        this.chatLog.push(data);
        getChat(this.chatLog);
      }
    });
  }


  export default connectToChat;