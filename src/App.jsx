import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import { LoginPage } from './pages/LoginPage';
import { RegistrarsePage } from './pages/RegistrarsePage';
import { RecuperarClavePage } from './pages/RecuperarClavePage';
import { HomeConsumidorPage } from './pages/HomeConsumidorPage';
import { HomeVendedorPage } from './pages/HomeVendedorPage';
import { HomeResponsablePage } from './pages/HomeResponsablePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registrarse" element={<RegistrarsePage />} />
          <Route path="/recuperar-clave" element={<RecuperarClavePage />} />

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

          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
