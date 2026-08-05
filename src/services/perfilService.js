import api from './api';

/**
 * Servicio para operaciones del CU-04: Modificar Perfil.
 * La instancia `api` ya inyecta el Bearer Token automáticamente
 * via el interceptor definido en api.js.
 *
 * Base URL: /api/perfil  (sin prefijo /v1/)
 */
export const perfilService = {
  /**
   * Obtiene los datos del perfil del usuario autenticado.
   * La respuesta varía según el rol:
   *   - Consumidor: { capodo, unombre, uapellido, uemail }
   *   - Vendedor:   { vtelefono, unombre, uapellido, uemail }
   * @returns {Promise<Object>} Datos del perfil.
   */
  obtenerPerfilMe: async () => {
    const response = await api.get('/perfil/me');
    return response.data;
  },

  /**
   * Actualiza el perfil de un Consumidor autenticado.
   * Si `nuevaContrasenna` es null o "" el backend NO modifica la contraseña.
   * @param {{ capodo: string, unombre: string, uapellido: string, uemail: string, nuevaContrasenna: string|null }} data
   * @returns {Promise<void>} 204 No Content en caso de éxito.
   */
  modificarPerfilConsumidor: async (data) => {
    const response = await api.put('/perfil/consumidor', data);
    return response.data;
  },

  /**
   * Actualiza el perfil de un Vendedor autenticado.
   * Si `nuevaContrasenna` es null o "" el backend NO modifica la contraseña.
   * @param {{ vtelefono: string, unombre: string, uapellido: string, uemail: string, nuevaContrasenna: string|null }} data
   * @returns {Promise<void>} 204 No Content en caso de éxito.
   */
  modificarPerfilVendedor: async (data) => {
    const response = await api.put('/perfil/vendedor', data);
    return response.data;
  },
};
