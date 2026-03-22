import React, { useState, useEffect } from 'react';
import { Cloud, CloudOff } from 'lucide-react';
import { getSyncQueue } from '../../utils/db';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check sync queue periodically
    const checkQueue = async () => {
      try {
        const queue = await getSyncQueue();
        setQueueCount(queue.length);
      } catch (err) {
        console.error('Failed to get queue count:', err);
      }
    };

    checkQueue();
    const interval = setInterval(checkQueue, 5000); 

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

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
      boxShadow: 'var(--shadow-md)'
    }}>
      {isOnline ? (
        <>
          <Cloud size={16} />
          {queueCount} en attente de sync
        </>
      ) : (
        <>
          <CloudOff size={16} />
          Mode hors ligne
        </>
      )}
    </div>
  );
};

export default OfflineIndicator;