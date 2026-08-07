import api from './api';

export const productService = {
  getCategorias: async () => {
    const response = await api.get('/v1/productos-busqueda/categorias');
    return response.data;
  },

  getProductosPorCategoria: async (cCodigo) => {
    const response = await api.get(`/v1/productos-busqueda/categorias/${cCodigo}/productos`);
    return response.data;
  }
};
