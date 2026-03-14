import React, { useState } from 'react';
import { 
  Menu, X, Package, TrendingUp, 
  Clock, FileText, UserPlus, Download, 
  LogOut, Moon, Sun 
} from 'lucide-react';
import './HamburgerMenu.css';

const HamburgerMenu = ({ 
  activeTab, 
  onTabChange, 
  userRole, 
  onAddWorker, 
  onRestore, 
  onLogout,
  theme,
  onThemeToggle 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
  { id: 'inventory', label: 'Inventaire', icon: Package, show: true },
  { id: 'sales', label: 'Ventes', icon: TrendingUp, show: true },
  { id: 'history', label: 'Historique', icon: Clock, show: true },
  { id: 'reports', label: 'Rapports', icon: FileText, show: true }, 
];

  const handleItemClick = (id) => {
  if (id === 'add-worker') {
    onAddWorker();
  } else if (id === 'restore') {
    onRestore();
  } else if (id === 'logout') {
    onLogout();  
  } else if (id === 'theme') {
    onThemeToggle();
  } else {
    onTabChange(id);
  }
  setIsOpen(false);
};

  return (
    <>
      {/* Menu Button */}
      <button className="hamburger-btn" onClick={() => setIsOpen(true)}>
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {isOpen && <div className="menu-overlay" onClick={() => setIsOpen(false)} />}

      {/* Sidebar Menu */}
      <div className={`sidebar-menu ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="menu-header">
          <div className="menu-title">
            <Package size={28} />
            <span>StockAlert</span>
          </div>
          <button className="menu-close" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="menu-nav">
          {menuItems.filter(item => item.show).map(item => (
            <button
              key={item.id}
              className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleItemClick(item.id)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="menu-divider" />

{/* Actions */}
<div className="menu-actions">
  {/* Theme Toggle */}
  <button className="menu-item" onClick={() => handleItemClick('theme')}>
    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    <span>{theme === 'light' ? 'Mode sombre' : 'Mode clair'}</span>
  </button>

  {/* Owner Only Actions */}
  {userRole === 'owner' && (
    <>
      <button className="menu-item" onClick={() => handleItemClick('add-worker')}>
        <UserPlus size={20} />
        <span>Ajouter travailleur</span>
      </button>

      <button className="menu-item" onClick={() => handleItemClick('restore')}>
        <Download size={20} />
        <span>Restaurer du cloud</span>
      </button>
    </>
  )}

  {/* Logout */}
  <button className="menu-item danger" onClick={() => handleItemClick('logout')}>
    <LogOut size={20} />
    <span>Déconnexion</span>
  </button>
</div>
      </div>
    </>
  );
}

export default HamburgerMenu;