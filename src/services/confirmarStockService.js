import api from './api';

/**
 * Servicio para el CU-14: Confirmar Stock.
 * La instancia `api` ya inyecta el Bearer Token automáticamente
 * via el interceptor definido en api.js.
 * Y también maneja automáticamente errores 401/403.
 *
 * Base URL interna de api.js es '/api'
 * Endpoints usan el prefijo '/v1' explícito ya que api.js no lo incluye por defecto.
 */
export const confirmarStockService = {
  /**
   * Obtiene la lista de comercios asociados al vendedor autenticado.
   * GET /api/v1/vendedores/me/comercios
   * @returns {Promise<Array>} Lista de comercios
   */
  listarComerciosVendedor: async () => {
    const response = await api.get('/v1/vendedores/me/comercios');
    return response.data;
  },

  /**
   * Obtiene la lista de consultas de stock pendientes para un comercio específico.
   * GET /api/v1/comercios/{cCodigo}/consultas-stock/pendientes
   * @param {string|number} cCodigo
   * @returns {Promise<Array>} Lista de consultas pendientes
   */
  listarConsultasPendientes: async (cCodigo) => {
    const response = await api.get(`/v1/comercios/${cCodigo}/consultas-stock/pendientes`);
    return response.data;
  },

  /**
   * Obtiene los niveles de stock (rangos) configurados para evaluación dinámica.
   * GET /api/v1/consultas-stock/{csContador}/niveles-stock
   * @param {string|number} csContador
   * @returns {Promise<Array>} Lista de niveles de stock
   */
  obtenerNivelesStock: async (csContador) => {
    const response = await api.get(`/v1/consultas-stock/${csContador}/niveles-stock`);
    return response.data;
  },

  /**
   * Confirma y responde a una consulta de stock.
   * POST /api/v1/consultas-stock/{csContador}/confirmar
   * @param {string|number} csContador
   * @param {Object} payload DTO ConfirmarStockRequestDTO { csMarcasRespuesta, csDescripcionRespuesta, csPrecioRespuesta, csCantidadRespuesta }
   * @returns {Promise<Object>}
   */
  confirmarStock: async (csContador, payload) => {
    const response = await api.post(`/v1/consultas-stock/${csContador}/confirmar`, payload);
    return response.data;
  },
};
