import React from 'react';

/**
 * UI-17 — Modal: Contraseña restablecida con éxito.
 * CU-05: Recuperar Credencial — Camino Feliz (200 OK).
 * Props:
 *   isOpen  {boolean} — controla visibilidad
 *   onClose {Function} — callback; el padre debe navegar a /login al llamarlo
 */
export const PasswordRestoredModal = ({ isOpen, onClose }) => {
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
      {/* Tarjeta del modal — Design System MendoHard */}
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
        {/* Botón de cierre (X) — esquina superior derecha */}
        <button
          id="password-restored-modal-close"
          onClick={onClose}
          aria-label="Cerrar modal"
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

        {/* Título */}
        <h2 style={{
          fontSize: '1.2rem',
          fontWeight: 'bold',
          color: '#1E293B',
          marginTop: '0.25rem',
          marginBottom: '1.25rem',
          textAlign: 'center'
        }}>
          Contraseña Restablecida
        </h2>

        {/* Mensaje principal */}
        <p style={{
          fontSize: '1.1rem',
          fontWeight: 'bold',
          color: '#1E293B',
          marginBottom: '0.75rem',
          textAlign: 'center',
          lineHeight: '1.5'
        }}>
          La contraseña ha sido restablecida con éxito
        </p>

        {/* Subtexto informativo */}
        <p style={{
          fontSize: '0.95rem',
          color: '#334155',
          marginBottom: '1.5rem',
          textAlign: 'center',
          lineHeight: '1.4'
        }}>
          Ya podés iniciar sesión con tu nueva contraseña.
        </p>

        {/* Botón Aceptar — centrado */}
        <button
          id="password-restored-modal-accept"
          onClick={onClose}
          style={{
            backgroundColor: '#4A7BB0',
            border: '1px solid #1E293B',
            borderRadius: '8px',
            padding: '8px 32px',
            color: '#1E293B',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
            fontFamily: 'Nunito, sans-serif'
          }}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};
