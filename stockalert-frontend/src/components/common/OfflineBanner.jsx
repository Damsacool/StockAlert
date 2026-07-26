import React from 'react';

const OfflineBanner = ({ offline }) => {
  if (!offline) return null;

  return (
    <div style={{ backgroundColor: '#f59e0b', color: '#fff', padding: '0.75rem', textAlign: 'center' }}>
      Mode hors ligne actif
    </div>
  );
};

export default OfflineBanner;
