import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';
import './InstallPrompt.css';

const InstallPrompt = () => {
  const { isInstallable, promptInstall } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || dismissed) {
    return null;
  }

  const handleInstall = async () => {
    const accepted = await promptInstall();
    if (!accepted) {
      setDismissed(true);
    }
  };

  return (
    <div className="install-prompt">
      <div className="install-prompt-content">
        <div className="install-prompt-icon">
          <Download size={24} />
        </div>
        <div className="install-prompt-text">
          <h3>Installer StockAlert</h3>
          <p>Accès rapide depuis votre écran d'accueil</p>
        </div>
        <button className="install-prompt-button" onClick={handleInstall}>
          Installer
        </button>
        <button className="install-prompt-close" onClick={() => setDismissed(true)}>
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;