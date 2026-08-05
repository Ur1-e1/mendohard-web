import api from './api';

export const authService = {
  getUbicacionesVendedor: async () => {
    const response = await api.get('/v1/auth/registro/vendedor/ubicaciones');
    return response.data;
  },

  registerConsumidor: async (data) => {
    const response = await api.post('/v1/auth/registro/consumidor', data);
    return response.data;
  },

  registerVendedor: async (data) => {
    const response = await api.post('/v1/auth/registro/vendedor', data);
    return response.data;
  }
};
