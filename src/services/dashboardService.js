import api from './api';

/**
 * Servicio para obtener métricas del dashboard del Responsable MendoHard.
 */
export const dashboardService = {
  /**
   * Obtiene las métricas en tiempo real.
   * @returns {Promise<Object>} - Datos de métricas {usuariosTotales, vendedoresPendientes, comerciosActivos}.
   */
  getMetricasResponsable: async () => {
    const response = await api.get('/v1/dashboard/responsable/metricas');
    return response.data;
  },
};
