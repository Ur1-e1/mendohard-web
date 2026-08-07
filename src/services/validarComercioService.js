import api from './api';

export const validarComercioService = {
  consultarComerciosPendientes: async () => {
    const response = await api.get('/v1/comercios/validar/pendientes');
    return response.data;
  },

  obtenerDetalleComercio: async (cCodigo) => {
    const response = await api.get(`/v1/comercios/validar/${cCodigo}`);
    return response.data;
  },

  procesarDecisionValidacion: async (cCodigo, decision) => {
    const response = await api.post(`/v1/comercios/validar/${cCodigo}/decision`, {
      decisionValidacion: decision
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }
};
