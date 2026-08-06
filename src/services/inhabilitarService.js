import api from './api';

export const inhabilitarService = {
  getConsumidoresActivos: async () => {
    const response = await api.get('/v1/usuarios/inhabilitar/consumidores');
    return response.data;
  },

  inhabilitarConsumidor: async (uCodigo) => {
    const response = await api.put(`/v1/usuarios/inhabilitar/consumidores/${uCodigo}`);
    return response.data;
  },

  getVendedoresActivos: async () => {
    const response = await api.get('/v1/usuarios/inhabilitar/vendedores');
    return response.data;
  },

  inhabilitarVendedor: async (uCodigo) => {
    const response = await api.put(`/v1/usuarios/inhabilitar/vendedores/${uCodigo}`);
    return response.data;
  }
};
