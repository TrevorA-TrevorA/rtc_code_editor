import consumer from "./consumer"

   const connectToChat = (callback) => {
    return consumer.subscriptions.create("ChatChannel", {
      chatLog: [],
      
      connected() {
        console.log("connected...")
        // Called when the subscription is ready for use on the server
      },

      disconnected() {
        // Called when the subscription has been terminated by the server
      },

      received(data) {
        console.log(data)
        this.chatLog.push(data);
        callback(this.chatLog);
      }
    });
  }


  export default connectToChat;