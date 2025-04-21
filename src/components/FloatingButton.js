import React from 'react';

const FloatingButton = ({ onClick }) => (
  <button
    style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      width: 60,
      height: 60,
      borderRadius: '50%',
      backgroundColor: '#2196f3',
      color: '#fff',
      fontSize: 32,
      border: 'none',
      cursor: 'pointer',
    }}
    onClick={onClick}
  >
    +
  </button>
);

export default FloatingButton;
