import { useNavigate } from 'react-router-dom';

export const SelectProfilePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '1rem', padding: '2rem' }}>
        <h1 style={{ color: '#1E293B', marginBottom: '0.5rem', fontFamily: 'Nunito', fontWeight: 'bold' }}>MendoHard</h1>
        <h2 style={{ marginBottom: '1.5rem', color: '#334155', fontSize: '1.5rem', fontFamily: 'Nunito' }}>Registrarse</h2>
        <p style={{ marginBottom: '2rem', color: '#334155', fontFamily: 'Nunito' }}>Seleccione un perfil</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            style={{ backgroundColor: '#4A7BB0', color: '#1E293B', fontWeight: 'bold', border: 'none', borderRadius: '8px', padding: '12px', cursor: 'pointer', fontFamily: 'Nunito', fontSize: '1rem' }} 
            onClick={() => navigate('/registro/consumidor')}
          >
            Comprador
          </button>
          <button 
            style={{ backgroundColor: '#4A7BB0', color: '#1E293B', fontWeight: 'bold', border: 'none', borderRadius: '8px', padding: '12px', cursor: 'pointer', fontFamily: 'Nunito', fontSize: '1rem' }} 
            onClick={() => navigate('/registro/vendedor')}
          >
            Vendedor
          </button>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#334155', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'Nunito' }}>
            Volver al Inicio de Sesión
          </button>
        </div>
      </div>
    </div>
  );
};
