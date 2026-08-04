import { useNavigate } from 'react-router-dom';

export const RegistrarsePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--btn-primary)', marginBottom: '0.5rem' }}>MendoHard</h1>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '1.5rem' }}>Registrarse</h2>
        <p style={{ marginBottom: '2rem', color: 'var(--text-main)' }}>Seleccione un perfil</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button className="btn-primary" onClick={() => alert('Flujo de Comprador no implementado')}>Comprador</button>
          <button className="btn-primary" onClick={() => alert('Flujo de Vendedor no implementado')}>Vendedor</button>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: 'var(--link-secondary)', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'Nunito' }}>
            Volver al Inicio de Sesión
          </button>
        </div>
      </div>
    </div>
  );
};
