import React from 'react';

const CategoryFilter = ({ products, activeCategory, onChange }) => {
  const categories = [...new Set(
    products.map(p => p.category).filter(Boolean)
  )].sort();

  if (categories.length === 0) return null;

  const chipStyle = (active) => ({
    flexShrink: 0,
    padding: '7px 16px',
    borderRadius: '20px',
    border: '1px solid',
    borderColor: active ? 'var(--primary)' : 'var(--border)',
    background: active ? 'var(--primary)' : 'var(--surface)',
    color: active ? 'white' : 'var(--text-secondary)',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  });

  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      overflowX: 'auto',
      paddingBottom: '4px',
      marginBottom: '16px',
      WebkitOverflowScrolling: 'touch',
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
    }}>
      <style>{`.cat-scroll::-webkit-scrollbar{display:none}`}</style>

      <button style={chipStyle(activeCategory === 'all')} onClick={() => onChange('all')}>
        Tous
      </button>

      {categories.map(cat => (
        <button
          key={cat}
          style={chipStyle(activeCategory === cat)}
          onClick={() => onChange(activeCategory === cat ? 'all' : cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;