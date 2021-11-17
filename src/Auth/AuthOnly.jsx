import React, { useRef, useState } from 'react';
import './AuthOnly.css';
import Message from '../Message/Message.jsx';

const AuthOnly = ({ children }) => {
  const loginRef = useRef(null);
  const passRef = useRef(null);
  const registerRadioRef = useRef(null);
  const [message, setMessage] = useState(null);
  const doAuth = async (e) => {
    e.preventDefault();
    const login = loginRef.current.value;
    const pass = passRef.current.value;
    const registerChecked = registerRadioRef.current.checked;
    const res = await fetch('/api/auth', {
      headers: { login, pass, register: registerChecked },
    });
    const result = await res.json();
    if (res.status === 200) {
      const d = new Date();
      d.setHours(d.getHours() + 3);
      document.cookie =
        'token=' + result + '; Path=/; Expires=' + d.toUTCString() + ';';
      document.location.reload();
    }

    if (result) {
      setMessage(result);
    }
  };

  const token = document.cookie
    .split(';')
    .filter((item) => item.startsWith('token='))
    .join('')
    .replace('token=', '');
  if (!token) {
    return (
      <form className="auth">
        <Message messageHandler={setMessage}>{message ? message : ''}</Message>
        <input type="text" placeholder="Login" ref={loginRef} />
        <input type="password" placeholder="Password" ref={passRef} />
        <input
          type="radio"
          name="method"
          id="Login"
          value="login"
          defaultChecked
        />
        <label htmlFor="Login">Login</label>
        <input
          type="radio"
          name="method"
          id="Register"
          value="register"
          ref={registerRadioRef}
        />
        <label htmlFor="Register">Register</label>
        <input type="submit" onClick={doAuth} />
      </form>
    );
  }
  return <div>{children}</div>;
};

export default AuthOnly;
