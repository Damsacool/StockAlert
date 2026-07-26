import api from './client';

export const getAll = async () => {
  const response = await api.get('/api/products');
  return response.data.data;
};

export const createProduct = async (payload) => {
  const response = await api.post('/api/products', payload);
  return response.data.data;
};

export const updateStock = async (productId, quantity) => {
  const response = await api.patch(`/api/products/${productId}/stock`, { quantity });
  return response.data.data;
};

export const updateProduct = async (productId, payload) => {
  const response = await api.put(`/api/products/${productId}`, payload);
  return response.data.data;
};

export const deleteProduct = async (productId) => {
  const response = await api.delete(`/api/products/${productId}`);
  return response.data.data;
};
