import api from './api';

export const vendedorService = {
  getVendedoresPendientes: async () => {
    const response = await api.get('/v1/vendedores/pendientes');
    return response.data;
  },

  getVendedorPendienteByCodigo: async (uCodigo) => {
    const response = await api.get(`/v1/vendedores/pendientes/${uCodigo}`);
    return response.data;
  },

  validarVendedor: async (uCodigo, decisionValidacion) => {
    const payload = {
      uCodigo,
      decisionValidacion
    };
    const response = await api.put('/v1/vendedores/validar', payload);
    return response.data;
  }
};
