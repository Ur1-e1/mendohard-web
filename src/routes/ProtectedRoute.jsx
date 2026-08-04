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

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    // Redirigir a login si no está autenticado, pero guardando la ruta intentada
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user) {
    if (!allowedRoles.includes(user.rolNombre)) {
      // Redirigir al home correspondiente si no tiene el rol
      return <Navigate to={getHomePathByRole(user.rolNombre)} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
