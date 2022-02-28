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
      boxOpen: true,

      received(data) {
        if (data.message) {
          this.chatLog.push(data);
          getChat(this.chatLog);
          return;
        }

        if (data.arrival) {
          getHeaderMessage(data);
          sendChatLog(data, this.chatLog);
        }
        
        if (data.headerMessage) {
          if (!this.boxOpen) return;
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
      }
    });
  }


  export default connectToChat;