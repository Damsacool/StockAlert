import React from 'react';
import { Package } from 'lucide-react';

const LoadingScreen = () => {
    return (
        <div style={{
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)',
}}>
  <div style={{ textAlign: 'center' }}>
    <Package size={64} color="var(--primary)" />
    <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Chargement...</p>
  </div>
</div>
    );
};

export default LoadingScreen;