import React, { useState } from 'react';
import {
  Menu, X, Package,
  UserPlus, Download, Upload,
  LogOut, Moon, Sun, MessageCircle,
  MapPin, Truck, Users
} from 'lucide-react';
import './HamburgerMenu.css';

const HamburgerMenu = ({
  userRole,
  onAddWorker,
  onRestore,
  onBulkImport,
  onLogout,
  theme,
  onThemeToggle,
  onWhatsAppSetup,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger button */}
      <button className="hamburger-btn" onClick={() => setIsOpen(true)}>
        <Menu size={24} />
      </button>

      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="menu-overlay"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar-menu ${isOpen ? 'open' : ''}`}>

        {/* Header */}
        <div className="menu-header">
          <div className="menu-title">
            <Package size={26} />
            <span>StockAlert</span>
          </div>
          <button className="menu-close" onClick={close}>
            <X size={20} />
          </button>
        </div>

        {/* Scrollable content */}
        <nav className="menu-nav">

          {/* Theme toggle */}
          <button className="menu-item" onClick={() => { onThemeToggle(); close(); }}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            <span>{theme === 'light' ? 'Mode sombre' : 'Mode clair'}</span>
          </button>

          <div className="menu-divider" />

          {/* WhatsApp alerts — owner only */}
          {userRole === 'owner' && onWhatsAppSetup && (
            <button className="menu-item" onClick={() => { onWhatsAppSetup(); close(); }}>
              <MessageCircle size={20} color="#25D366" />
              <span>Alertes WhatsApp</span>
            </button>
          )}

          {/* Owner-only actions */}
          {userRole === 'owner' && (
            <>
              <button className="menu-item" onClick={() => { onAddWorker(); close(); }}>
                <UserPlus size={20} />
                <span>Ajouter un travailleur</span>
              </button>

              <button className="menu-item" onClick={() => { onBulkImport(); close(); }}>
                <Upload size={20} />
                <span>Import en masse</span>
              </button>
            </>
          )}

          {/* Restore from cloud — all users */}
          <button className="menu-item" onClick={() => { onRestore(); close(); }}>
            <Download size={20} />
            <span>Restaurer du cloud</span>
          </button>

          <div className="menu-divider" />

          {/* Coming soon features — greyed out, no action */}
          <div style={{ padding: '8px 16px 4px', fontSize: '11px', fontWeight: '700',
            color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Bientôt disponible
          </div>

          <button className="menu-item coming-soon" disabled>
            <MapPin size={20} />
            <span>Multi-boutique</span>
            <span className="soon-badge">Bientôt</span>
          </button>

          <button className="menu-item coming-soon" disabled>
            <Truck size={20} />
            <span>Fournisseurs</span>
            <span className="soon-badge">Bientôt</span>
          </button>

          <button className="menu-item coming-soon" disabled>
            <Users size={20} />
            <span>Crédit client</span>
            <span className="soon-badge">Bientôt</span>
          </button>

        </nav>

        {/* Logout at bottom */}
        <div className="menu-actions">
          <button className="menu-item danger" onClick={() => { onLogout(); close(); }}>
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>

      </div>
    </>
  );
};

export default HamburgerMenu;