import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';

export const SelectOptionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pCodigo = location.state?.pCodigo;

  if (!pCodigo) {
    return <Navigate to="/buscar-categoria" replace />;
  }

  const handleSpecificStore = () => {
    navigate('/consultar-stock/especifico', { state: { pCodigo } });
  };

  const handleClosestStores = () => {
    navigate('/consultar-stock/cercanos', { state: { pCodigo } });
  };

  const handleMapDirectly = () => {
    // Navigate directly to map page with pCodigo in query params
    navigate(`/consultar-stock/mapa?pCodigo=${pCodigo}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div style={{ 
      backgroundColor: '#CBD5E1', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '2rem' 
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '600px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        position: 'relative'
      }}>
        {/* Back Button */}
        <button 
          onClick={handleBack}
          style={{
            position: 'absolute',
            top: '1.5rem',
            left: '1.5rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.2rem',
            color: '#334155'
          }}
        >
          ← Atrás
        </button>

        <h1 style={{ fontFamily: 'Nunito', color: '#334155', textAlign: 'center', marginTop: '1rem', marginBottom: '0.5rem' }}>
          MendoHard
        </h1>
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 'bold', color: '#334155', textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.3rem' }}>
          Consultar Stock
        </h2>
        <h3 style={{ fontFamily: 'Nunito', color: '#334155', textAlign: 'center', marginBottom: '2rem', fontSize: '1.1rem', fontWeight: 'normal' }}>
          Seleccionar una de estas opciones
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            style={{ 
              backgroundColor: '#4A7BB0', 
              color: '#1E293B', 
              fontWeight: 'bold', 
              border: 'none', 
              borderRadius: '4px',
              padding: '1rem',
              fontSize: '1rem',
              cursor: 'pointer',
              fontFamily: 'Nunito'
            }}
            onClick={handleSpecificStore}
          >
            Consultar Stock en un Comercio en Especifico
          </button>
          <button 
            style={{ 
              backgroundColor: '#4A7BB0', 
              color: '#1E293B', 
              fontWeight: 'bold', 
              border: 'none', 
              borderRadius: '4px',
              padding: '1rem',
              fontSize: '1rem',
              cursor: 'pointer',
              fontFamily: 'Nunito'
            }}
            onClick={handleClosestStores}
          >
            Consultar Stock a los 5 Comercios mas Cercanos
          </button>
          <button 
            style={{ 
              backgroundColor: '#4A7BB0', 
              color: '#1E293B', 
              fontWeight: 'bold', 
              border: 'none', 
              borderRadius: '4px',
              padding: '1rem',
              fontSize: '1rem',
              cursor: 'pointer',
              fontFamily: 'Nunito'
            }}
            onClick={handleMapDirectly}
          >
            Ir Directamente al Mapa donde se ve la disponibilidad de Stock
          </button>
        </div>
      </div>
    </div>
  );
};
