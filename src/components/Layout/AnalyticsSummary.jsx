import React from 'react';
import { Package, TrendingUp, AlertTriangle } from 'lucide-react';
import './AnalyticsSummary.css';

const AnalyticsSummary = ({ products }) => {
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  const highestStock = products.reduce((max, p) => p.stock > max.stock ? p : max, products[0]);

  return (
    <div className="analytics-grid">
      <div className="stat-card">
        <div className="stat-icon primary">
          <Package size={24} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Total produits</span>
          <span className="stat-value">{totalProducts}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon success">
          <TrendingUp size={24} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Article en stock</span>
          <span className="stat-value">{totalStock}</span>
        </div>
      </div>

      <div className="stat-card alert">
        <div className="stat-icon danger">
          <AlertTriangle size={24} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Stock bas</span>
          <span className="stat-value">{lowStockCount}</span>
        </div>
      </div>

      {highestStock && (
        <div className="stat-card highlight">
          <div className="stat-icon success">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Plus en stock</span>
            <span className="stat-value truncate">{highestStock.name}</span>
            <span className="stat-sub">{highestStock.stock} unités</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsSummary;