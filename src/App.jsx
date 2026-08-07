import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import { LoginPage } from './pages/LoginPage';
import { SelectProfilePage } from './pages/SelectProfilePage';
import { RegisterConsumerPage } from './pages/RegisterConsumerPage';
import { RegisterVendorPage } from './pages/RegisterVendorPage';
import { RequestRecoveryPage } from './pages/RequestRecoveryPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { HomeConsumidorPage } from './pages/HomeConsumidorPage';
import { HomeVendedorPage } from './pages/HomeVendedorPage';
import { HomeResponsablePage } from './pages/HomeResponsablePage';
import { RegisterResponsablePage } from './pages/RegisterResponsablePage';
import { EditConsumerProfilePage } from './pages/EditConsumerProfilePage';
import { EditVendorProfilePage } from './pages/EditVendorProfilePage';
import { GestionarRolesPage } from './pages/GestionarRolesPage';
import { AsignarPermisoModal } from './components/modals/AsignarPermisoModal';
import { AsignarPermisoSeleccionarModal } from './components/modals/AsignarPermisoSeleccionarModal';
import { QuitarPermisoModal } from './components/modals/QuitarPermisoModal';
import { QuitarPermisoSeleccionarModal } from './components/modals/QuitarPermisoSeleccionarModal';
import { DisableUserPage } from './pages/inhabilitar/DisableUserPage';
import { DisableConsumerPage } from './pages/inhabilitar/DisableConsumerPage';
import { DisableVendorPage } from './pages/inhabilitar/DisableVendorPage';
import { ValidateVendorListPage } from './pages/validar-vendedor/ValidateVendorListPage';
import { ValidateVendorDetailPage } from './pages/validar-vendedor/ValidateVendorDetailPage';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registrarse" element={<SelectProfilePage />} />
          <Route path="/registro/consumidor" element={<RegisterConsumerPage />} />
          <Route path="/registro/vendedor" element={<RegisterVendorPage />} />
          {/* Rutas CU-05: Recuperar Credencial (públicas) */}
          <Route path="/recuperar-credencial" element={<RequestRecoveryPage />} />
          <Route path="/recuperar-credencial/restablecer" element={<ResetPasswordPage />} />

          {/* Rutas Protegidas por Rol */}
          <Route 
            path="/home-consumidor" 
            element={
              <ProtectedRoute allowedRoles={['Consumidor']}>
                <HomeConsumidorPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/home-vendedor" 
            element={
              <ProtectedRoute allowedRoles={['Vendedor']}>
                <HomeVendedorPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/home-responsable" 
            element={
              <ProtectedRoute allowedRoles={['Responsable MendoHard']}>
                <HomeResponsablePage />
              </ProtectedRoute>
            } 
          />

          <Route
            path="/responsable/registrar"
            element={
              <ProtectedRoute allowedRoles={['Responsable MendoHard']}>
                <RegisterResponsablePage />
              </ProtectedRoute>
            }
          />

          {/* Rutas CU-06: Gestionar Roles / Permisos */}
          <Route
            path="/gestionar-roles"
            element={
              <ProtectedRoute allowedRoles={['Responsable MendoHard']}>
                <GestionarRolesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestionar-roles/asignar"
            element={
              <ProtectedRoute allowedRoles={['Responsable MendoHard']}>
                <AsignarPermisoModal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestionar-roles/asignar/permiso"
            element={
              <ProtectedRoute allowedRoles={['Responsable MendoHard']}>
                <AsignarPermisoSeleccionarModal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestionar-roles/quitar"
            element={
              <ProtectedRoute allowedRoles={['Responsable MendoHard']}>
                <QuitarPermisoModal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestionar-roles/quitar/permiso"
            element={
              <ProtectedRoute allowedRoles={['Responsable MendoHard']}>
                <QuitarPermisoSeleccionarModal />
              </ProtectedRoute>
            }
          />

          {/* Rutas CU-07: Inhabilitar Usuario */}
          <Route
            path="/usuarios/inhabilitar"
            element={
              <ProtectedRoute allowedRoles={['Responsable MendoHard']}>
                <DisableUserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios/inhabilitar/consumidores"
            element={
              <ProtectedRoute allowedRoles={['Responsable MendoHard']}>
                <DisableConsumerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios/inhabilitar/vendedores"
            element={
              <ProtectedRoute allowedRoles={['Responsable MendoHard']}>
                <DisableVendorPage />
              </ProtectedRoute>
            }
          />

          {/* Rutas CU-08: Validar Vendedor */}
          <Route
            path="/admin/validar-vendedor"
            element={
              <ProtectedRoute allowedRoles={['Responsable MendoHard']}>
                <ValidateVendorListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/validar-vendedor/:uCodigo"
            element={
              <ProtectedRoute allowedRoles={['Responsable MendoHard']}>
                <ValidateVendorDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Rutas de Modificar Perfil (CU-04) */}
          <Route
            path="/perfil/consumidor"
            element={
              <ProtectedRoute allowedRoles={['Consumidor']}>
                <EditConsumerProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/perfil/vendedor"
            element={
              <ProtectedRoute allowedRoles={['Vendedor']}>
                <EditVendorProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
