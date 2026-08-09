import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const HomeVendedorPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const nombre = user?.nombreCompleto || 'Usuario';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1.5rem' }}>
      
      {/* Contenedor Principal */}
      <div style={{ width: '100%', maxWidth: '672px', display: 'flex', flexDirection: 'column' }}>
        
        {/* Módulo de Acciones Superior Derecha (Rectángulo Blanco) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <div className="card" style={{ display: 'flex', gap: '1rem', padding: '1rem 1.5rem', width: 'auto' }}>
            <button 
              className="btn-primary" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
              onClick={() => navigate('/vendedor/metricas/rango')}
            >
              Ver Métricas
            </button>
            <button
              className="btn-primary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
              onClick={() => navigate('/perfil/vendedor')}
            >
              Modificar Perfil
            </button>
          </div>
        </div>

        {/* Tarjeta Blanca Principal (Centro) */}
        <div className="card" style={{ width: '100%', padding: '2.5rem 3rem' }}>
          {/* Encabezado */}
          <h1 style={{ color: 'var(--btn-primary)', marginBottom: '1.5rem', textAlign: 'center' }}>
            MendoHard
          </h1>
          
          {/* Saludo */}
          <h2 style={{ marginBottom: '2.5rem', textAlign: 'left', color: '#1E293B', fontWeight: 700 }}>
            Buen día {nombre}
          </h2>
          
          {/* Cuerpo (2 botones centrados) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', marginBottom: '2.5rem' }}>
            <button 
              className="btn-primary" 
              style={{ padding: '0.85rem 2.5rem', fontSize: '1.05rem', width: '100%', maxWidth: '450px' }}
              onClick={() => navigate('/vendedor/comercios')}
            >
              Confirmar stock de componentes de hardware
            </button>
            <button 
              className="btn-primary" 
              style={{ padding: '0.85rem 2.5rem', fontSize: '1.05rem', width: '100%', maxWidth: '450px' }}
              onClick={() => navigate('/comercios/registrar')}
            >
              Registrar un nuevo Comercio
            </button>
          </div>

          {/* Pie de Tarjeta */}
          <div style={{ textAlign: 'center' }}>
            <button 
              onClick={logout} 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--border-error)', 
                cursor: 'pointer', 
                textDecoration: 'underline', 
                fontFamily: 'Nunito', 
                fontSize: '1rem' 
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};
