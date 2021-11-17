import React from 'react';
import './Message.css';

const Message = ({ children, messageHandler }) => {
  return (
    <div className="message" hidden={!children}>
      {children}
      <button
        onClick={(e) => {
          e.preventDefault();
          messageHandler(false);
        }}
      >
        X
      </button>
    </div>
  );
};
export default Message;
