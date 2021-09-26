import consumer from "./consumer"

   const connectToChat = (
      getChat, 
      sendArrivalNotice, 
      sendExitNotice, 
      getHeaderMessage
     ) => {
       
    return consumer.subscriptions.create("ChatChannel", {
      chatLog: [],

      connected() {
        console.log("chat channel connected...")
        sendArrivalNotice()
      },

      disconnected() {
        sendExitNotice();
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