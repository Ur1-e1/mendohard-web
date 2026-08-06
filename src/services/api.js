import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Interceptor para inyectar el token en las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para atrapar 401 y 403 y redirigir al login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config && (error.config.url.includes('/auth') || error.config.url.includes('/login'));
    
    if (error.response && (error.response.status === 401 || error.response.status === 403) && !isAuthEndpoint) {
      // Capturamos el 401 y 403 "ACCESS_DENIED"
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
