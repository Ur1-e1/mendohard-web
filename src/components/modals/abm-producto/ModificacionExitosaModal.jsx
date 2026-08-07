import React from 'react';

export const ModificacionExitosaModal = ({ onClose, onAccept }) => {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#CBD5E1', border: '2px solid #1E293B', borderRadius: '1rem',
        padding: '2rem', width: '400px', maxWidth: '90%', position: 'relative',
        display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'Nunito'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            backgroundColor: '#FFFFFF', border: '1px solid #1E293B', borderRadius: '4px',
            width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center',
            cursor: 'pointer', fontWeight: 'bold', color: '#1E293B'
          }}
        >
          X
        </button>
        <h3 style={{ color: '#334155', textAlign: 'center', marginTop: '1rem', marginBottom: '2rem', fontSize: '1.2rem' }}>
          El producto ha sido modificado correctamente
        </h3>
        <button 
          onClick={onAccept}
          style={{
            backgroundColor: '#4A7BB0', color: '#1E293B', fontWeight: 'bold', border: 'none',
            borderRadius: '4px', padding: '0.75rem 2rem', cursor: 'pointer', fontSize: '1rem'
          }}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};
