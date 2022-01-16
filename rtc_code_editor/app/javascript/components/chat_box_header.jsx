import React from 'react';

class ChatBoxHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(next) {
    return next.headerMessageTime !== this.props.headerMessageTime;
  }

  componentDidUpdate() {
    if (this.props.headerMessage.length > 18) {
      $(".chat-header-text").css({ fontSize: 16 })
    }

    $(".chat-header-text").css({ opacity: 1 })

    setTimeout(() => {
      $(".chat-header-text").animate({ opacity: 0 }, 300)
    }, 2000)
  }

  render() {
    return (
      <div id="chatBoxHeader">
        <h2 className="chat-header-text">{this.props.headerMessage}</h2>
      </div>
    )
  }
}

export default ChatBoxHeader;