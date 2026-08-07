import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const HomeConsumidorPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // Asumimos que el apodo viene en extraData.apodo o en el nombre
  const apodo = user?.extraData?.apodo || user?.nombreCompleto || 'Usuario';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1.5rem' }}>
      
      {/* Contenedor Principal (max-w-2xl w-full) */}
      <div style={{ width: '100%', maxWidth: '672px', display: 'flex', flexDirection: 'column' }}>
        
        {/* Botón Modificar Perfil Arriba a la derecha */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
          <button
            className="btn-primary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
            onClick={() => navigate('/perfil/consumidor')}
          >
            Modificar Perfil
          </button>
        </div>

        {/* Tarjeta Blanca Ampliada */}
        <div className="card" style={{ width: '100%', padding: '2.5rem 3rem' }}>
          <h1 style={{ color: 'var(--btn-primary)', marginBottom: '1.5rem', textAlign: 'center' }}>MendoHard</h1>
          
          <h2 style={{ marginBottom: '2.5rem', textAlign: 'left', color: '#1E293B', fontWeight: 700 }}>
            Buen día {apodo}
          </h2>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
            <button className="btn-primary" style={{ padding: '0.85rem 2.5rem', fontSize: '1.1rem' }} onClick={() => navigate('/buscar-categoria')}>
              Buscar Componente de Hardware
            </button>
          </div>

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
