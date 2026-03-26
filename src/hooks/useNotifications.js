import { useState, useEffect, useCallback } from 'react';

export const useNotifications = () => {
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') {
      console.warn('Notifications not supported');
      return 'denied';
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (err) {
      console.error('Permission request failed:', err);
      return 'denied';
    }
  }, []);

  const sendLowStockAlert = useCallback((products) => {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
      return;
    }

    const lowStockCount = products.length;
    const productNames = products.slice(0, 3).map(p => p.name).join(', ');
    
    try {
      const notification = new Notification('⚠️ Stock Bas - StockAlert', {
        body: `${lowStockCount} produit${lowStockCount > 1 ? 's' : ''} en stock bas:\n${productNames}${products.length > 3 ? '...' : ''}`,
        icon: '/logo192.ico',
        badge: '/logo192.ico',
        tag: 'low-stock-alert',
        requireInteraction: true,
        silent: false
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto close after 10 seconds
      setTimeout(() => notification.close(), 10000);
    } catch (err) {
      console.error('Failed to send notification:', err);
    }
  }, []);

  return {
    permission,
    requestPermission,
    sendLowStockAlert
  };
};