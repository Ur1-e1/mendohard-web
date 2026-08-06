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
