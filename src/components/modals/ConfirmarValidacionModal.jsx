import React, { useState } from 'react';
import { validarComercioService } from '../../services/validarComercioService';

export const ConfirmarValidacionModal = ({ comercio, onClose, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);

  if (!comercio) return null;

  const handleAction = (decision) => {
    setLoading(true);
    validarComercioService.procesarDecisionValidacion(comercio.cCodigo, decision)
      .then(() => {
        onSuccess();
      })
      .catch((error) => {
        if (onError) onError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#CBD5E1', border: '2px solid #1E293B',
        borderRadius: '1rem', padding: '2rem', position: 'relative',
        width: '90%', maxWidth: '400px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
      }}>
        <button 
          onClick={onClose}
          disabled={loading}
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            backgroundColor: '#FFFFFF', border: '1px solid #1E293B',
            width: '30px', height: '30px', borderRadius: '4px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', color: '#1E293B'
          }}>
          X
        </button>
        
        <h2 style={{ fontFamily: 'Nunito, sans-serif', color: '#1E293B', textAlign: 'center', fontWeight: 'bold', marginBottom: '1rem', marginTop: '1rem' }}>
          ¿Acepta el comercio seleccionado?
        </h2>
        <p style={{ fontFamily: 'Nunito, sans-serif', color: '#334155', textAlign: 'center', marginBottom: '2rem', fontSize: '1.1rem' }}>
          Nombre: <strong>{comercio.cNombreFantasia}</strong>
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button onClick={() => handleAction('Aceptar')} disabled={loading} style={{
            backgroundColor: '#A7F3D0', color: '#1E293B', fontWeight: 'bold',
            border: '1px solid #059669', padding: '0.75rem 1.5rem', borderRadius: '8px',
            cursor: 'pointer', fontFamily: 'Nunito, sans-serif', opacity: loading ? 0.7 : 1
          }}>
            {loading ? 'Procesando...' : 'Aceptar'}
          </button>
          <button onClick={() => handleAction('Rechazar')} disabled={loading} style={{
            backgroundColor: '#FCA5A5', color: '#1E293B', fontWeight: 'bold',
            border: '1px solid #DC2626', padding: '0.75rem 1.5rem', borderRadius: '8px',
            cursor: 'pointer', fontFamily: 'Nunito, sans-serif', opacity: loading ? 0.7 : 1
          }}>
            {loading ? 'Procesando...' : 'Rechazar'}
          </button>
        </div>
      </div>
    </div>
  );
};
