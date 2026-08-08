import api from './api';

export const consultasStockService = {
  getComercios: async () => {
    const response = await api.get('/v1/consultas-stock/comercios');
    return response.data;
  },

  getMapaStock: async (pCodigo) => {
    const response = await api.get(`/v1/consultas-stock/mapa?pCodigo=${pCodigo}`);
    return response.data;
  },

  consultarStockEspecifico: async (pCodigo, cCodigo) => {
    const response = await api.post('/v1/consultas-stock/especifica', {
      PCodigo: pCodigo,
      CCodigo: cCodigo
    });
    return response.data;
  },

  consultarStockCercanos: async (pCodigo, lat, lng) => {
    const response = await api.post('/v1/consultas-stock/cercanos', {
      PCodigo: pCodigo,
      CSLatitudDemanda: lat,
      CSLongitudDemanda: lng
    });
    return response.data;
  }
};
