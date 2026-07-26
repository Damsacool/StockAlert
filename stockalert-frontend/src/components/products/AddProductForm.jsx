import React, { useState } from 'react';
import Button from '../common/Button';

const AddProductForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [stock, setStock] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ name, stock: Number(stock) });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom du produit" required />
      <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Stock" required />
      <Button type="submit">Ajouter</Button>
    </form>
  );
};

export default AddProductForm;
