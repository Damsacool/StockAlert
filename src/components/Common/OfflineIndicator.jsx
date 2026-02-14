import React, { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";

const OfflineIndicator = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showReconnected, setShowReconnected] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setShowReconnected(true);
            setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
        setIsOnline(false);
        setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
}, []);

 if (showReconnected) {
    return (
        <div className="offline-indicator online">
            <Wifi size={18} />
            <span>Connexion rétablie</span>
        </div>
    );
 }
  if (!isOnline) {
    return null;
  }

  return (
        <div className="offline-indicator offline">
            <WifiOff size={18} />
            <span>Mode Hors ligne</span>
            <span className="offline-subtitle">Vos données sont sauvegardées localement</span>
        </div>
  );
 };

 export default OfflineIndicator;
 