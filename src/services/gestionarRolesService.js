import api from './api';

export const gestionarRolesService = {
  getRolesActivos: async () => {
    const response = await api.get('/v1/gestionar-roles/roles-activos');
    return response.data;
  },

  getPermisosActivos: async () => {
    const response = await api.get('/v1/gestionar-roles/permisos-activos');
    return response.data;
  },

  getPermisosByRol: async (rCodigo) => {
    const response = await api.get(`/v1/gestionar-roles/roles/${rCodigo}/permisos`);
    return response.data;
  },

  asignarPermiso: async (rCodigo, pCodigo) => {
    const response = await api.post('/v1/gestionar-roles/asignar-permiso', {
      RCodigo: rCodigo,
      PCodigo: pCodigo
    });
    return response.data;
  },

  quitarPermiso: async (rCodigo, pCodigo) => {
    const response = await api.post('/v1/gestionar-roles/quitar-permiso', {
      RCodigo: rCodigo,
      PCodigo: pCodigo
    });
    return response.data;
  },

  registrarOpcionNavegacion: async (opcionSeleccionada) => {
    const response = await api.post('/v1/gestionar-roles/opcion-navegacion', {
      opcionSeleccionada: opcionSeleccionada
    });
    return response.data;
  }
};
