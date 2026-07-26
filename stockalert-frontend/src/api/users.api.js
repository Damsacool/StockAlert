import api from './client';

export const getMe = async () => {
  const response = await api.get('/api/users/me');
  return response.data.data;
};

export const updateMe = async (payload) => {
  const response = await api.patch('/api/users/me', payload);
  return response.data.data;
};

export const createWorker = async (payload) => {
  const response = await api.post('/api/users/workers', payload);
  return response.data.data;
};

export const getWorkers = async () => {
  const response = await api.get('/api/users/workers');
  return response.data.data;
};
