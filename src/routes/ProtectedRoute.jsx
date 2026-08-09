import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const getHomePathByRole = (rolNombre) => {
  switch (rolNombre) {
    case 'Consumidor':
      return '/home-consumidor';
    case 'Vendedor':
      return '/home-vendedor';
    case 'Responsable MendoHard':
      return '/home-responsable';
    default:
      return '/login';
  }
};

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const ProtectedRoute = ({ children, allowedRoles, allowedPermissions }) => {
  const { isAuthenticated, user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user) {
    if (!allowedRoles.includes(user.rolNombre)) {
      return <Navigate to={getHomePathByRole(user.rolNombre)} replace />;
    }
  }

  if (allowedPermissions && token) {
    const decodedToken = parseJwt(token);

    // Extrae autoridades/permisos del token sin importar el nombre de clave usado
    const rawAuthorities = decodedToken?.authorities || decodedToken?.permisos || decodedToken?.permissions || [];

    // Normaliza a strings simples (soporta tanto ["ver_metricas"] como [{ authority: "ver_metricas" }])
    const authList = Array.isArray(rawAuthorities)
      ? rawAuthorities.map(a => (typeof a === 'string' ? a : a?.authority || a?.name || ''))
      : [];

    console.log('🔍 [ProtectedRoute] Permisos en Token:', authList);

    const hasPermission = allowedPermissions.some(perm => authList.includes(perm));

    if (!hasPermission) {
      console.warn(`⚠️ [ProtectedRoute] Acceso denegado: Falta el permiso [${allowedPermissions.join(', ')}]`);
      return <Navigate to={getHomePathByRole(user?.rolNombre)} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;