import React from 'react';
import './AuthOnly.css';

const doAuth = () => {
  //doThis
};

const AuthOnly = ({ children }) => {
  if (!document.cookie) {
    return (
      <form className="auth">
        <input type="text" placeholder="Login" />
        <input type="password" placeholder="Password" />
        <input type="submit" onClick={doAuth} />
      </form>
    );
  }
  return <div>{children}</div>;
};

export default AuthOnly;
