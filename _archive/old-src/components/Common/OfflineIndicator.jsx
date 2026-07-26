import React, { useState, useEffect } from 'react';
import { Cloud, CloudOff, CheckCircle } from 'lucide-react';
import { getSyncQueue } from '../../utils/db';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueCount, setQueueCount] = useState(0);
  const [justSynced, setJustSynced] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Check queue after a short delay to let sync run first
      setTimeout(() => checkQueue(), 3000);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const checkQueue = async () => {
      try {
        const queue = await getSyncQueue();
        const newCount = queue.length;

        // If there are items and now there are none, show "synced" briefly
        if (queueCount > 0 && newCount === 0) {
          setJustSynced(true);
          setTimeout(() => setJustSynced(false), 3000);
        }

        setQueueCount(newCount);
      } catch (err) {
    
      }
    };

    checkQueue();
    // Poll every 4 seconds, stops showing stale count
    const interval = setInterval(checkQueue, 4000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [queueCount]);

  // Show "just synced" success state briefly
  if (justSynced) {
    return (
      <div style={{
        position: 'fixed',
        top: '70px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--success-light)',
        color: 'var(--success)',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '600',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: 'var(--shadow-md)',
        animation: 'fadeIn 0.3s ease',
      }}>
        <CheckCircle size={15} />
        Synchronisé ✓
      </div>
    );
  }

  // Nothing to show when online and queue is empty
  if (isOnline && queueCount === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '70px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: isOnline ? 'var(--warning-light)' : 'var(--danger-light)',
      color: isOnline ? 'var(--warning)' : 'var(--danger)',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '600',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: 'var(--shadow-md)',
    }}>
      {isOnline ? (
        <>
          <Cloud size={15} />
          Sync en cours...
        </>
      ) : (
        <>
          <CloudOff size={15} />
          Hors ligne — {queueCount} en attente
        </>
      )}
    </div>
  );
};

export default OfflineIndicator;