import api from './api';

/**
 * Servicio para operaciones relacionadas con Responsables MendoHard.
 * La instancia `api` ya inyecta el Bearer Token automáticamente
 * via el interceptor definido en api.js.
 */
export const responsableService = {
  /**
   * Registra un nuevo Responsable MendoHard.
   * @param {Object} data - DTO con los campos del formulario.
   * @param {string} data.uNombre
   * @param {string} data.uApellido
   * @param {string} data.uEmail
   * @param {string} data.rmhLegajo
   * @param {string} data.contrasenna
   * @param {string} data.confirmacionContrasenna
   * @returns {Promise<Object>} - Respuesta del servidor (201 Created).
   */
  registrarResponsable: async (data) => {
    const response = await api.post('/v1/responsables/registro', data);
    return response.data;
  },
};
