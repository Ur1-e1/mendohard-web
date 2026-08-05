import React from 'react';

export const PasswordMismatchModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#CBD5E1',
        border: '2px solid #1E293B',
        borderRadius: '1rem',
        padding: '1.5rem',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: '#FFFFFF',
            border: '2px solid #1E293B',
            borderRadius: '6px',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            color: '#1E293B'
          }}
        >
          ✕
        </button>

        <h2 style={{
          fontSize: '1.2rem',
          fontWeight: 'bold',
          color: '#1E293B',
          marginTop: '0.25rem',
          marginBottom: '1.25rem',
          textAlign: 'center'
        }}>
          Confirmación contraseña
        </h2>

        <p style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: '#1E293B',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          La Contraseña y su confirmación no son iguales
        </p>

        <button
          onClick={onClose}
          style={{
            backgroundColor: '#4A7BB0',
            border: '1px solid #1E293B',
            borderRadius: '8px',
            padding: '8px 28px',
            color: '#1E293B',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};
