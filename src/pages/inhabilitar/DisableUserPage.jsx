import { useNavigate } from 'react-router-dom';

export const DisableUserPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#CBD5E1',
      fontFamily: 'Nunito, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        padding: '2rem',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <h1 style={{
          color: '#334155',
          margin: '0 0 0.5rem 0',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          MendoHard
        </h1>
        
        <h2 style={{
          color: '#334155',
          margin: '0 0 1.5rem 0',
          fontSize: '1.25rem',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          Inhabilitar Usuario
        </h2>
        
        <p style={{
          color: '#334155',
          margin: '0 0 2rem 0',
          fontSize: '1rem',
          textAlign: 'center'
        }}>
          Seleccionar una de estas opciones
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
          <button
            onClick={() => navigate('/usuarios/inhabilitar/consumidores')}
            style={{
              backgroundColor: '#4A7BB0',
              color: '#1E293B',
              border: '1px solid #1E293B',
              borderRadius: '8px',
              padding: '10px 16px',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'center'
            }}
          >
            Consumidor
          </button>
          
          <button
            onClick={() => navigate('/usuarios/inhabilitar/vendedores')}
            style={{
              backgroundColor: '#4A7BB0',
              color: '#1E293B',
              border: '1px solid #1E293B',
              borderRadius: '8px',
              padding: '10px 16px',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'center'
            }}
          >
            Vendedor
          </button>
        </div>
        
        <button
          onClick={() => navigate('/home-responsable')}
          style={{
            marginTop: '1.5rem',
            background: 'none',
            border: 'none',
            color: '#4A7BB0',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Volver al panel
        </button>
      </div>
    </div>
  );
};
