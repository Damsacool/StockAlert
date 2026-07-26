import React from 'react';

const BottomNav = ({ activeTab = 'inventory' }) => {
  const items = [
    { id: 'inventory', label: 'Inventaire' },
    { id: 'sales', label: 'Ventes' },
    { id: 'history', label: 'Historique' },
  ];

  return (
    <nav
      style={{
        position: 'sticky',
        bottom: 0,
        display: 'flex',
        justifyContent: 'space-around',
        padding: '0.75rem 0',
        backgroundColor: '#fff',
        borderTop: '1px solid #e5e7eb',
      }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          style={{
            border: 'none',
            background: 'transparent',
            color: activeTab === item.id ? '#2563eb' : '#6b7280',
            fontWeight: activeTab === item.id ? 700 : 500,
          }}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
