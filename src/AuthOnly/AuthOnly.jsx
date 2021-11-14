import React, { useRef } from 'react';
import './AuthOnly.css';

const AuthOnly = ({ children }) => {
  const loginRef = useRef(null);
  const passRef = useRef(null);
  const doAuth = async (e) => {
    e.preventDefault();
    const login = loginRef.current.value;
    const pass = passRef.current.value;

    const res = await fetch('/api/auth', {
      headers: { login, pass },
    });

    document.cookie = 'token=' + (await res.json());
    document.location.reload();
  };

  const token = document.cookie
    .split(';')
    .filter((item) => item.startsWith('token='))
    .join('')
    .replace('token=', '');
  if (!token) {
    return (
      <form className="auth">
        <input type="text" placeholder="Login" ref={loginRef} />
        <input type="password" placeholder="Password" ref={passRef} />
        <input type="submit" onClick={doAuth} />
      </form>
    );
  }
  return <div>{children}</div>;
};

export default AuthOnly;
