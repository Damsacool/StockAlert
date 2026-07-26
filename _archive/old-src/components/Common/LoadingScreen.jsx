import React from 'react';
import { Package } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        marginBottom: '24px',
        color: 'var(--primary)'
      }}>
        <Package size={48} strokeWidth={1.5} />
      </div>

      <div style={{
        width: '60px',
        height: '60px',
        border: '4px solid var(--border)',
        borderTopColor: 'var(--primary)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      
      <p style={{
        marginTop: '24px',
        fontSize: '16px',
        fontWeight: '600',
        color: 'var(--text-primary)'
      }}>
        Chargement...
      </p>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;