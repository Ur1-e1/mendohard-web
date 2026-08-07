import api from './api';

export const productoService = {
  obtenerCategoriasActivas: async () => {
    const response = await api.get('/v1/productos/categorias-activas');
    return response.data;
  },

  obtenerProductosActivos: async () => {
    const response = await api.get('/v1/productos/activos');
    return response.data;
  },

  obtenerProducto: async (codigo) => {
    const response = await api.get(`/v1/productos/${codigo}`);
    return response.data;
  },

  crearProducto: async (datos) => {
    const response = await api.post('/v1/productos', datos);
    return response.data;
  },

  modificarProducto: async (codigo, datos) => {
    const response = await api.put(`/v1/productos/${codigo}`, datos);
    return response.data;
  },

  deshabilitarProducto: async (codigo) => {
    const response = await api.patch(`/v1/productos/${codigo}/deshabilitar`);
    return response.data;
  }
};
