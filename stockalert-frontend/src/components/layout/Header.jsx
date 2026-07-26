import React from 'react';

const Header = ({ title = 'StockAlert', subtitle = 'Gestion d’inventaire', rightContent = null }) => {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.25rem',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      <div>
        <h1 style={{ margin: 0, fontSize: '1.1rem', color: '#111827' }}>{title}</h1>
        {subtitle ? (
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.9rem', color: '#6b7280' }}>{subtitle}</p>
        ) : null}
      </div>

      <div>{rightContent}</div>
    </header>
  );
};

export default Header;
