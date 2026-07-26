import React from 'react';

const Modal = ({ open, children, title }) => {
  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#fff', borderRadius: '0.75rem', padding: '1rem', width: '100%', maxWidth: '28rem' }}>
        {title ? <h3 style={{ marginTop: 0 }}>{title}</h3> : null}
        {children}
      </div>
    </div>
  );
};

export default Modal;
