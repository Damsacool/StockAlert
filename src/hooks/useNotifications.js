import { useState, useEffect, useCallback } from "react";   

export const useNotifications = () => {
    const [permission, setPermission] = useState('default');
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        if ('Notification' in window) {
            setIsSupported(true);
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = useCallback(async () => {
        if (!isSupported) return false;

        try {
            const result = await Notification.requestPermission();
            setPermission(result);  
            return result === 'granted';
        } catch (error) {
            console.error('[Notifications] Error:', error);
            return false;
        }
    }, [isSupported]);

    const sendNotification = useCallback((title, options = {})=> {
        if (!isSupported || permission !== 'granted') return null;

        try {
            const notification = new Notification(title, {
                icon: '/logo192.png',
                badge: '/logo192.png',
                ...options
            });
            
            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            return notification;
            } catch (error) {
                console.error('[Notifications] Send failed:', error);
                return null;
            };
        }, [isSupported, permission]);

        const sendLowStockAlert = useCallback((lowStockProducts = []) => {
            if (!lowStockProducts.length) return;

            const count = lowStockProducts.length;
            const title = count === 1
            ? '⚠️ Stock Faible' 
            : `⚠️ ${count} Produits en Stock Faible`;

            const productNames = lowStockProducts
            .slice(0, 3)
            .map(p => p.name)
            .join(', ');

            const body = count === 1
             ? `${productNames} - Stock: ${lowStockProducts[0].stock}`
             : `${productNames}${count > 3 ? ` et ${count - 3} autres` : ''}`;

             return sendNotification(title, { body });
         }, [sendNotification]);

    return {
        permission,
        isSupported,
        requestPermission,
        sendNotification,
        sendLowStockAlert
    };
};