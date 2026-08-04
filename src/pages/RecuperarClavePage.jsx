import { useNavigate } from 'react-router-dom';

export const RecuperarClavePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--btn-primary)', marginBottom: '0.5rem' }}>MendoHard</h1>
        <h2 style={{ marginBottom: '2rem', color: 'var(--text-main)', fontSize: '1.2rem' }}>Ingrese su Email Registrado</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); alert('Flujo de recuperación no implementado'); }}>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <input 
              type="email" 
              className="form-input" 
              placeholder="Email" 
              required
            />
          </div>
          
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Siguiente</button>
        </form>

        <div style={{ marginTop: '2rem' }}>
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: 'var(--link-secondary)', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'Nunito' }}>
            Volver al Inicio de Sesión
          </button>
        </div>
      </div>
    </div>
  );
};
