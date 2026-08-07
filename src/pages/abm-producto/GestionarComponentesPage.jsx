import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const GestionarComponentesPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    const handlePopState = (event) => {
      event.preventDefault();
      navigate('/home-responsable', { replace: true });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);


  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', backgroundColor: '#CBD5E1', fontFamily: 'Nunito', padding: '2rem'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '1rem',
        padding: '2.5rem', width: '100%', maxWidth: '1000px', margin: '0 auto',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        {/* Header con botón atrás */}
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: '2rem', position: 'relative' }}>
          <button 
            onClick={() => navigate('/home-responsable', { replace: true })}
            style={{
              position: 'absolute', left: 0,
              backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
              color: '#334155', fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center'
            }}
          >
            &#8592; Atrás
          </button>
          <div style={{ width: '100%', textAlign: 'center' }}>
            <h1 style={{ margin: 0, color: '#334155', fontSize: '1.5rem', fontWeight: 800 }}>MendoHard</h1>
            <h2 style={{ margin: 0, color: '#334155', fontSize: '1.2rem', fontWeight: 600 }}>Gestionar Componentes de Hardware</h2>
          </div>
        </div>

        <h3 style={{ color: '#334155', fontSize: '1rem', marginBottom: '2rem', fontWeight: 500 }}>
          Seleccionar una de estas opciones
        </h3>

        {/* Botones de acción */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '400px' }}>
          <button 
            onClick={() => navigate('/admin/componentes/alta')}
            style={{
              backgroundColor: '#4A7BB0', color: '#1E293B', fontWeight: 'bold', border: 'none',
              borderRadius: '4px', padding: '1rem', cursor: 'pointer', fontSize: '1rem', textAlign: 'center'
            }}
          >
            Dar de alta, un componente de Hardware
          </button>

          <button 
            onClick={() => navigate('/admin/componentes/modificar')}
            style={{
              backgroundColor: '#4A7BB0', color: '#1E293B', fontWeight: 'bold', border: 'none',
              borderRadius: '4px', padding: '1rem', cursor: 'pointer', fontSize: '1rem', textAlign: 'center'
            }}
          >
            Modificar un componente de Hardware
          </button>

          <button 
            onClick={() => navigate('/admin/componentes/baja')}
            style={{
              backgroundColor: '#4A7BB0', color: '#1E293B', fontWeight: 'bold', border: 'none',
              borderRadius: '4px', padding: '1rem', cursor: 'pointer', fontSize: '1rem', textAlign: 'center'
            }}
          >
            Dar de baja, un componente de Hardware
          </button>
        </div>

      </div>
    </div>
  );
};
