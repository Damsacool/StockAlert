import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Package, TrendingDown, TrendingUp, Calendar, Filter } from 'lucide-react';
import { getAllTransactions } from '../../utils/db';

const TransactionHistory = ({ products }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [dateRange, setDateRange] = useState('all'); // 'all', 'today', 'week', 'month'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...transactions];

    // Filter by product
    if (selectedProduct !== 'all') {
      filtered = filtered.filter(t => t.productId === parseInt(selectedProduct));
    }

    // Filter by date range
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    if (dateRange === 'today') {
      filtered = filtered.filter(t => new Date(t.date) >= today);
    } else if (dateRange === 'week') {
      filtered = filtered.filter(t => new Date(t.date) >= weekAgo);
    } else if (dateRange === 'month') {
      filtered = filtered.filter(t => new Date(t.date) >= monthAgo);
    }

    setFilteredTransactions(filtered);
  }, [transactions, selectedProduct, dateRange]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const loadTransactions = async () => {
    try {
      const allTransactions = await getAllTransactions();
      setTransactions(allTransactions.sort((a, b) => b.timestamp - a.timestamp)); // Newest first
      setLoading(false);
    } catch (error) {
      console.error('Failed to load transactions:', error);
      setLoading(false);
    }
  };

  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="transaction-history">
        <p>Chargement de l'historique...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="transaction-history">
        <div className="no-transactions">
          <Clock size={48} color="#9ca3af" />
          <p>Aucune transaction</p>
          <p className="no-transactions-hint">Les transactions apparaîtront ici</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-history">
      <div className="history-header">
        <h2>
          <Clock size={24} />
          Historique des Transactions
        </h2>
        <p className="history-count">{filteredTransactions.length} transaction(s)</p>
      </div>

      {/* Filters */}
      <div className="history-filters">
        {/* Product Filter */}
        <div className="filter-group">
          <label>
            <Package size={16} />
            Produit:
          </label>
          <select 
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="history-select"
          >
            <option value="all">Tous les produits</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filter */}
        <div className="filter-group">
          <label>
            <Calendar size={16} />
            Période:
          </label>
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="history-select"
          >
            <option value="all">Toutes les dates</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">7 derniers jours</option>
            <option value="month">30 derniers jours</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <div className="transaction-list">
        {filteredTransactions.length === 0 ? (
          <div className="no-results">
            <Filter size={32} color="#9ca3af" />
            <p>Aucune transaction pour ces filtres</p>
          </div>
        ) : (
          filteredTransactions.map(transaction => (
            <div key={transaction.id} className="transaction-item">
              <div className={`transaction-icon ${transaction.type}`}>
                {transaction.type === 'sale' ? (
                  <TrendingDown size={20} />
                ) : (
                  <TrendingUp size={20} />
                )}
              </div>

              <div className="transaction-details">
                <p className="transaction-product">{transaction.productName}</p>
                <p className="transaction-meta">
                  <span className={`transaction-quantity ${transaction.type}`}>
                    {transaction.type === 'sale' ? '-' : '+'}{transaction.quantity}
                  </span>
                  <span className="transaction-stock-change">
                    {transaction.oldStock} → {transaction.newStock}
                  </span>
                </p>
              </div>

              <div className="transaction-time">
                <Clock size={14} />
                <span>{formatDate(transaction.date)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;