import api from './api';

/**
 * Servicio para el flujo CU-05: Recuperar Credencial.
 * Endpoints públicos — no requieren token Bearer.
 * Base URL heredada de api.js: http://localhost:8080/api
 */
export const recuperarCredencialService = {

  /**
   * PASO 1 del flujo — Solicitar código OTP por email.
   * POST /api/v1/auth/recuperar-credencial/solicitar
   * @param {string} email
   * @returns {Promise} 200 OK con { message: "Si el correo electrónico..." }
   */
  solicitarRecuperacion: async (email) => {
    const response = await api.post('/v1/auth/recuperar-credencial/solicitar', { email });
    return response.data;
  },

  /**
   * PASO 2 del flujo — Restablecer contraseña con código OTP.
   * POST /api/v1/auth/recuperar-credencial/restablecer
   * @param {{ email, codigoIngresado, nuevaContrasena, confirmacionContrasena }} data
   * @returns {Promise} 200 OK con { message: "La contraseña ha sido restablecida con éxito" }
   */
  restablecerCredencial: async (data) => {
    const response = await api.post('/v1/auth/recuperar-credencial/restablecer', data);
    return response.data;
  },
};
