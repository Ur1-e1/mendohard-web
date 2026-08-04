import React from 'react';

export const InvalidPasswordModal = ({ isOpen, onClose, fallidos = 1 }) => {
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
      {/* TARJETA UNIFICADA GRIS-AZUL */}
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
        {/* BOTÓN DE CIERRE (X) */}
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

        {/* TÍTULO PRINCIPAL */}
        <h2 style={{
          fontSize: '1.35rem',
          fontWeight: 'bold',
          color: '#1E293B',
          marginTop: '0.25rem',
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}>
          Contraseña no valida
        </h2>

        {/* SUBTEXTO LÍMITE */}
        <p style={{
          fontSize: '1rem',
          color: '#1E293B',
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}>
          El limite de intentos fallidos es de 10
        </p>

        {/* CONTADOR DE INTENTOS FALLIDOS (EN TEXTO OSCURO) */}
        <p style={{
          fontSize: '1rem',
          color: '#1E293B',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          Intentos Fallidos: {fallidos}
        </p>

        {/* BOTÓN ACEPTAR CENTRADO */}
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
