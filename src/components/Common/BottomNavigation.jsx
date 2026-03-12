import React from 'react';
import { Package, TrendingUp, Plus, Clock, FileText } from 'lucide-react';
import './BottomNavigation.css';

const BottomNavigation = ({ activeTab, onTabChange, onAddProduct, userRole }) => {
  const tabs = [
  { id: 'inventory', label: 'Inventaire', icon: Package },
  { id: 'sales', label: 'Ventes', icon: TrendingUp },
  { id: 'add', label: '', icon: Plus, isAction: true },
  { id: 'history', label: 'Historique', icon: Clock },
  { id: 'reports', label: 'Rapports', icon: FileText }, 
];

  const handleTabClick = (tab) => {
    if (tab.isAction) {
      onAddProduct();
    } else {
      onTabChange(tab.id);
    }
  };

  return (
    <nav className="bottom-nav">
      {tabs
        .filter(tab => !tab.ownerOnly || userRole === 'owner')
        .map(tab => (
          <button
            key={tab.id}
            className={`nav-item ${tab.isAction ? 'action-btn' : ''} ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabClick(tab)}
          >
            <tab.icon size={tab.isAction ? 28 : 22} />
            {tab.label && <span className="nav-label">{tab.label}</span>}
          </button>
        ))}
    </nav>
  );
};

export default BottomNavigation;