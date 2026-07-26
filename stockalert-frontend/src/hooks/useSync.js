import { useEffect } from 'react';
import { syncQueue } from '../offline/sync';

export const useSync = () => {
  useEffect(() => {
    const handleOnline = () => {
      syncQueue();
    };

    window.addEventListener('online', handleOnline);

    if (navigator.onLine) {
      syncQueue();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);
};
