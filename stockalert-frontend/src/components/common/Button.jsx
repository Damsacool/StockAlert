import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary' }) => {
  const styles = {
    primary: {
      backgroundColor: '#2563eb',
      color: '#fff',
      border: 'none',
      padding: '0.7rem 1rem',
      borderRadius: '0.5rem',
      cursor: 'pointer',
    },
    secondary: {
      backgroundColor: '#e5e7eb',
      color: '#111827',
      border: 'none',
      padding: '0.7rem 1rem',
      borderRadius: '0.5rem',
      cursor: 'pointer',
    },
  };

  return (
    <button type={type} onClick={onClick} style={styles[variant] || styles.primary}>
      {children}
    </button>
  );
};

export default Button;
