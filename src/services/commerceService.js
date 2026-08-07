import api from './api';

export const getUbicaciones = async () => {
  const response = await api.get('/v1/comercios/ubicaciones');
  return response.data;
};

export const registrarComercio = async (data) => {
  const response = await api.post('/v1/comercios', data);
  return response.data;
};
