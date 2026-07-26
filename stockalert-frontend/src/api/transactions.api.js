import api from './client';

export const getAll = async () => {
  const response = await api.get('/api/transactions');
  return response.data.data;
};

export const getByProduct = async (productId) => {
  const response = await api.get(`/api/transactions/${productId}`);
  return response.data.data;
};
