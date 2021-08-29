import React from 'react';
import AceEditor from 'react-ace';
import "ace-builds";
import "ace-builds/webpack-resolver";

class Room extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
    <div className="room">
      <AceEditor
      height="60%"
      width="45%"
      mode="javascript"
      theme="monokai"
      />
    </div>
    )
  }
}

export default Room;