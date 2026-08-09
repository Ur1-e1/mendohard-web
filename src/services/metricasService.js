import api from './api';

export const metricasService = {
  obtenerMetricas: async (fechaDesde, fechaHasta) => {
    const response = await api.get('/v1/metricas', {
      params: {
        fechaDesde,
        fechaHasta
      }
    });
    return response.data;
  }
};
