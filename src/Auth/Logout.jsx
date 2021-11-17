import React from 'react';

const Logout = () => {
  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          document.cookie += '; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          document.location.reload();
        }}
        style={{ position: 'absolute', top: '10px', right: '10px' }}
      >
        Logout
      </button>
    </>
  );
};

export default Logout;
